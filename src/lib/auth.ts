import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db } from './db';
import { users, accounts } from './db/schema';
import { isLoginLocked, trackFailedLogin, clearFailedLogins } from './rate-limit';
import { cookies } from 'next/headers';
import { friendships } from './db/schema';
import { sortFriendPair, countFriends } from './db/friends';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
  }),
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 }, // 30 days
  pages: {
    signIn: '/login',
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = (credentials.email as string).toLowerCase();
        const password = credentials.password as string;

        // Check if account is locked from too many failed attempts
        if (isLoginLocked(email)) {
          return null;
        }

        const result = await db
          .select({
            id: users.id,
            email: users.email,
            name: users.name,
            image: users.image,
            displayName: users.displayName,
            passwordHash: users.passwordHash,
          })
          .from(users)
          .where(eq(users.email, email))
          .limit(1);

        if (result.length === 0) {
          trackFailedLogin(email);
          return null;
        }

        const user = result[0];
        if (!user.passwordHash) return null;

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
          trackFailedLogin(email);
          return null;
        }

        // Successful login — clear failed attempts
        clearFailedLogins(email);

        return {
          id: user.id,
          email: user.email,
          name: user.displayName || user.name,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile, trigger, session }) {
      if (user) {
        // Initial sign-in: populate token from the user record
        token.id = user.id;
        const [row] = await db
          .select({ passwordChangedAt: users.passwordChangedAt })
          .from(users)
          .where(eq(users.id, user.id as string))
          .limit(1);
        token.passwordChangedAt = row?.passwordChangedAt?.getTime() ?? null;
      } else if (token.id) {
        // Subsequent token refresh: check whether the password has changed since
        // this token was issued and reject the token if so.
        const [row] = await db
          .select({ passwordChangedAt: users.passwordChangedAt })
          .from(users)
          .where(eq(users.id, token.id as string))
          .limit(1);
        const currentChangedAt = row?.passwordChangedAt?.getTime() ?? null;
        const tokenChangedAt = (token.passwordChangedAt as number | null) ?? null;
        if (currentChangedAt !== null && (tokenChangedAt === null || currentChangedAt > tokenChangedAt)) {
          // Password was changed after this token was issued — force re-login
          return null;
        }
        token.passwordChangedAt = currentChangedAt;
      }

      if (account) {
        token.provider = account.provider;
      }
      // On OAuth sign-in, use the fresh profile name (DB record may be stale)
      if (profile?.name) {
        token.name = profile.name as string;
      }
      if (trigger === 'update') {
        if (session?.name) token.name = session.name;
        if (session?.image !== undefined) token.picture = session.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.id) {
        session.user.id = token.id as string;
      }
      if (token.name) {
        session.user.name = token.name;
      }
      if (token.picture !== undefined) {
        session.user.image = (token.picture as string) || undefined;
      }
      if (token.provider) {
        session.user.provider = token.provider as string;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      // Reject Google sign-ins with unverified email addresses
      if (account?.provider === 'google') {
        const googleProfile = profile as { email_verified?: boolean } | undefined;
        if (googleProfile?.email_verified !== true) {
          return false;
        }
      }

      if (user.id) {
        try {
          // Sync OAuth profile name to displayName on each sign-in.
          // `profile` has the fresh OAuth data; `user` is the stale DB record.
          const oauthName = (profile as { name?: string })?.name;
          if (account?.provider !== 'credentials' && oauthName) {
            await db
              .update(users)
              .set({ displayName: oauthName, name: oauthName })
              .where(eq(users.id, user.id));
          }

          const cookieStore = await cookies();
          const inviterId = cookieStore.get('invite_ref')?.value;

          if (inviterId && inviterId !== user.id) {
            const [inviterCount, userCount] = await Promise.all([
              countFriends(inviterId),
              countFriends(user.id),
            ]);

            if (inviterCount < 50 && userCount < 50) {
              const [low, high] = sortFriendPair(user.id, inviterId);
              await db.insert(friendships).values({ userId: low, friendId: high }).onConflictDoNothing();
              cookieStore.delete('invite_ref');
            }
            // If friend limit reached, keep the cookie so invite can be retried
          }
        } catch {
          // Non-critical — don't block sign-in
        }
      }
      return true;
    },
  },
  events: {
    async createUser({ user }) {
      // Set joinedDate for OAuth users auto-created by the adapter
      if (user.id) {
        try {
          await db
            .update(users)
            .set({
              joinedDate: new Date().toISOString().split('T')[0],
              displayName: user.name || 'Engineer',
            })
            .where(eq(users.id, user.id));
        } catch (err) {
          console.error('Failed to set joinedDate for new user:', err);
        }
      }
    },
  },
});
