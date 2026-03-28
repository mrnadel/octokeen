# Friends System V2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the friends system useful by adding invite links, a friend leaderboard, and activity snippets — and removing user search.

**Architecture:** Invite codes are stored on the `users` table and generated lazily. The `/invite/[code]` page sets an httpOnly cookie; after auth, a POST endpoint creates the friendship. The league page gets a "Friends" tab showing weekly XP rankings from `sessionHistory`. User search is removed entirely.

**Tech Stack:** Next.js App Router, Drizzle ORM (Postgres), next-auth, SWR, Framer Motion, Tailwind CSS

**Spec:** `docs/superpowers/specs/2026-03-23-friends-system-v2-design.md`

---

## Task 1: Schema — Add invite_code column and sessionHistory index

**Files:**
- Modify: `src/lib/db/schema.ts`

- [ ] **Step 1: Add inviteCode to users table**

In `src/lib/db/schema.ts`, add to the `users` table definition after the `updatedAt` field:

```typescript
inviteCode: text('invite_code').unique(),
```

- [ ] **Step 2: Add index on sessionHistory**

In `src/lib/db/schema.ts`, change the `sessionHistory` table to add an index. Replace the table definition so it includes a third argument:

```typescript
export const sessionHistory = pgTable('session_history', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  sessionId: text('session_id').notNull(),
  date: text('date').notNull(),
  durationMinutes: integer('duration_minutes').default(0).notNull(),
  questionsAttempted: integer('questions_attempted').default(0).notNull(),
  questionsCorrect: integer('questions_correct').default(0).notNull(),
  topicsCovered: jsonb('topics_covered').$type<string[]>().default([]),
  xpEarned: integer('xp_earned').default(0).notNull(),
}, (table) => [
  index('session_history_user_date_idx').on(table.userId, table.date),
]);
```

- [ ] **Step 3: Generate and run migration**

```bash
npx drizzle-kit generate
npx drizzle-kit push
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/db/schema.ts drizzle/
git commit -m "feat(friends-v2): add invite_code column and sessionHistory index"
```

---

## Task 2: API — Get/generate invite code

**Files:**
- Create: `src/app/api/invite/code/route.ts`

- [ ] **Step 1: Create the invite code API**

Create `src/app/api/invite/code/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { eq } from 'drizzle-orm';
import { getAuthUserId } from '@/lib/auth-utils';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { rateLimit } from '@/lib/rate-limit';

function generateInviteCode(): string {
  return crypto.randomBytes(6).toString('base64url').slice(0, 8);
}

export async function GET() {
  const userId = await getAuthUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const rl = rateLimit(`invite-code:${userId}`, { limit: 10, windowMs: 60_000 });
  if (!rl.success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  // Check if user already has a code
  const [user] = await db
    .select({ inviteCode: users.inviteCode })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (user?.inviteCode) {
    return NextResponse.json({ code: user.inviteCode });
  }

  // Generate a new code with retry on collision
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generateInviteCode();
    try {
      await db
        .update(users)
        .set({ inviteCode: code })
        .where(eq(users.id, userId));
      return NextResponse.json({ code });
    } catch (err: any) {
      // Unique constraint violation — retry
      if (err?.code === '23505') continue;
      throw err;
    }
  }

  return NextResponse.json({ error: 'Failed to generate code' }, { status: 500 });
}
```

- [ ] **Step 2: Create regenerate endpoint**

Create `src/app/api/invite/code/regenerate/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { eq } from 'drizzle-orm';
import { getAuthUserId } from '@/lib/auth-utils';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { rateLimit } from '@/lib/rate-limit';

export async function POST() {
  const userId = await getAuthUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const rl = rateLimit(`invite-regen:${userId}`, { limit: 3, windowMs: 3600_000 });
  if (!rl.success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  for (let attempt = 0; attempt < 5; attempt++) {
    const code = crypto.randomBytes(6).toString('base64url').slice(0, 8);
    try {
      await db
        .update(users)
        .set({ inviteCode: code })
        .where(eq(users.id, userId));
      return NextResponse.json({ code });
    } catch (err: any) {
      if (err?.code === '23505') continue;
      throw err;
    }
  }

  return NextResponse.json({ error: 'Failed to generate code' }, { status: 500 });
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/api/invite/code/
git commit -m "feat(friends-v2): add invite code get/regenerate API endpoints"
```

---

## Task 3: Invite Landing Page + Accept Endpoint

**Files:**
- Create: `src/app/invite/[code]/page.tsx`
- Create: `src/app/api/invite/accept/route.ts`

- [ ] **Step 1: Create the invite accept API**

Create `src/app/api/invite/accept/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getAuthUserId } from '@/lib/auth-utils';
import { db } from '@/lib/db';
import { users, friendships } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { areFriends, sortFriendPair, countFriends } from '@/lib/db/friends';
import { rateLimit } from '@/lib/rate-limit';

const MAX_FRIENDS = 50;

export async function POST() {
  const userId = await getAuthUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const rl = rateLimit(`invite-accept:${userId}`, { limit: 5, windowMs: 3600_000 });
  if (!rl.success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const cookieStore = await cookies();
  const inviterId = cookieStore.get('invite_ref')?.value;

  if (!inviterId) {
    return NextResponse.json({ error: 'No invite found' }, { status: 400 });
  }

  // Clear cookie
  cookieStore.delete('invite_ref');

  // Validate inviter exists
  const [inviter] = await db
    .select({ id: users.id, displayName: users.displayName })
    .from(users)
    .where(eq(users.id, inviterId))
    .limit(1);

  if (!inviter) {
    return NextResponse.json({ error: 'Inviter not found' }, { status: 404 });
  }

  // Self-invite check
  if (inviterId === userId) {
    return NextResponse.json({ error: 'Cannot add yourself' }, { status: 400 });
  }

  // Already friends check
  if (await areFriends(userId, inviterId)) {
    return NextResponse.json({ already: true, name: inviter.displayName });
  }

  // Cap check for both parties
  const [userCount, inviterCount] = await Promise.all([
    countFriends(userId),
    countFriends(inviterId),
  ]);

  if (userCount >= MAX_FRIENDS) {
    return NextResponse.json({ error: 'Your friends list is full' }, { status: 409 });
  }
  if (inviterCount >= MAX_FRIENDS) {
    return NextResponse.json({ error: "Inviter's friends list is full" }, { status: 409 });
  }

  // Create friendship
  const [low, high] = sortFriendPair(userId, inviterId);
  try {
    await db.insert(friendships).values({ userId: low, friendId: high });
  } catch (err: any) {
    // Already friends (unique constraint)
    if (err?.code === '23505') {
      return NextResponse.json({ already: true, name: inviter.displayName });
    }
    throw err;
  }

  return NextResponse.json({ success: true, name: inviter.displayName });
}
```

- [ ] **Step 2: Create a Route Handler to set the invite cookie**

NOTE: Server Components cannot set cookies. We use a Route Handler that the invite page calls on mount.

Create `src/app/api/invite/set-cookie/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';

export async function POST(request: Request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const { code } = body;
  if (!code || typeof code !== 'string') {
    return NextResponse.json({ error: 'Code required' }, { status: 400 });
  }

  const [inviter] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.inviteCode, code))
    .limit(1);

  if (!inviter) {
    return NextResponse.json({ error: 'Invalid code' }, { status: 404 });
  }

  const cookieStore = await cookies();
  cookieStore.set('invite_ref', inviter.id, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  return NextResponse.json({ success: true });
}
```

- [ ] **Step 3: Create the invite landing page**

Create `src/app/invite/[code]/page.tsx`:

```tsx
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { auth } from '@/lib/auth';
import InviteClient from './InviteClient';

interface Props {
  params: Promise<{ code: string }>;
}

export default async function InvitePage({ params }: Props) {
  const { code } = await params;

  // Look up inviter by code
  const [inviter] = await db
    .select({
      id: users.id,
      displayName: users.displayName,
      image: users.image,
    })
    .from(users)
    .where(eq(users.inviteCode, code))
    .limit(1);

  if (!inviter) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] px-4">
        <div className="text-center">
          <p className="text-5xl mb-4">🔗</p>
          <h1 className="text-xl font-extrabold text-surface-800 mb-2">Invalid Invite Link</h1>
          <p className="text-sm text-surface-500 mb-6">This link may have expired or been regenerated.</p>
          <a href="/register" className="px-6 py-3 rounded-xl bg-primary-600 text-white font-semibold text-sm hover:bg-primary-700 transition-colors">
            Sign Up Anyway
          </a>
        </div>
      </div>
    );
  }

  // Check if visitor is already logged in
  const session = await auth();
  const loggedIn = !!session?.user?.id;
  const isSelf = session?.user?.id === inviter.id;

  return (
    <InviteClient
      inviterName={inviter.displayName ?? 'A friend'}
      inviterImage={inviter.image}
      inviteCode={code}
      loggedIn={loggedIn}
      isSelf={isSelf}
    />
  );
}
```

- [ ] **Step 4: Create the invite client component**

Create `src/app/invite/[code]/InviteClient.tsx`:

```tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Props {
  inviterName: string;
  inviterImage: string | null;
  inviteCode: string;
  loggedIn: boolean;
  isSelf: boolean;
}

export default function InviteClient({ inviterName, inviterImage, inviteCode, loggedIn, isSelf }: Props) {
  const router = useRouter();
  const [accepting, setAccepting] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const cookieSet = useRef(false);

  // Set the invite cookie via API on mount (Server Components can't set cookies)
  useEffect(() => {
    if (cookieSet.current || isSelf) return;
    cookieSet.current = true;
    fetch('/api/invite/set-cookie', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: inviteCode }),
    }).catch(() => {});
  }, [inviteCode, isSelf]);

  // Self-invite redirect
  useEffect(() => {
    if (isSelf) router.replace('/friends');
  }, [isSelf, router]);

  async function handleAccept() {
    setAccepting(true);
    try {
      const res = await fetch('/api/invite/accept', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setResult('success');
        setTimeout(() => router.push('/friends'), 1500);
      } else if (data.already) {
        setResult('already');
        setTimeout(() => router.push('/friends'), 1500);
      } else {
        setResult(data.error || 'Something went wrong');
      }
    } catch {
      setResult('Something went wrong');
    } finally {
      setAccepting(false);
    }
  }

  if (isSelf) return null;

  const initials = inviterName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] px-4">
      <div className="bg-white rounded-2xl shadow-lg border border-surface-200 p-8 max-w-sm w-full text-center">
        {/* Inviter avatar */}
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center" style={{ background: '#E0E7FF' }}>
            {inviterImage ? (
              <img src={inviterImage} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-primary-700 font-bold text-2xl">{initials}</span>
            )}
          </div>
        </div>

        <h1 className="text-xl font-extrabold text-surface-900 mb-1">
          {inviterName} invited you!
        </h1>
        <p className="text-sm text-surface-500 mb-6">
          Join Octokeen and study mechanical engineering together.
        </p>

        {result === 'success' && (
          <div className="rounded-xl bg-green-50 border border-green-200 p-4 mb-4">
            <p className="text-sm font-semibold text-green-700">You're now friends with {inviterName}!</p>
          </div>
        )}
        {result === 'already' && (
          <div className="rounded-xl bg-blue-50 border border-blue-200 p-4 mb-4">
            <p className="text-sm font-semibold text-blue-700">You're already friends with {inviterName}!</p>
          </div>
        )}
        {result && result !== 'success' && result !== 'already' && (
          <div className="rounded-xl bg-red-50 border border-red-200 p-4 mb-4">
            <p className="text-sm font-semibold text-red-700">{result}</p>
          </div>
        )}

        {!result && loggedIn && (
          <button
            onClick={handleAccept}
            disabled={accepting}
            className="w-full py-3 rounded-xl bg-primary-600 text-white font-bold text-sm hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            {accepting ? 'Adding...' : `Add ${inviterName} as Friend`}
          </button>
        )}

        {!result && !loggedIn && (
          <div className="flex flex-col gap-3">
            <Link
              href="/register"
              className="w-full py-3 rounded-xl bg-primary-600 text-white font-bold text-sm hover:bg-primary-700 transition-colors text-center"
            >
              Join Octokeen
            </Link>
            <Link
              href="/login"
              className="text-sm font-semibold text-primary-600 hover:text-primary-700"
            >
              Already have an account? Log in
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add src/app/invite/ src/app/api/invite/accept/ src/app/api/invite/set-cookie/
git commit -m "feat(friends-v2): add invite landing page, cookie setter, and accept endpoint"
```

---

## Task 4: Auto-friendship after signup/login

**Files:**
- Modify: `src/lib/auth.ts`

- [ ] **Step 1: Add invite acceptance to createUser event**

In `src/lib/auth.ts`, add these imports at the top of the file:

```typescript
import { cookies } from 'next/headers';
import { friendships } from './db/schema';
import { sortFriendPair, countFriends } from './db/friends';
```

Then add a `signIn` callback inside the `callbacks` object (after the `session` callback). This fires on every login including first login after registration:

```typescript
async signIn({ user }) {
  // Process invite_ref cookie for auto-friendship
  if (user.id) {
    try {
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
        }

        cookieStore.delete('invite_ref');
      }
    } catch {
      // Non-critical — don't block sign-in
    }
  }
  return true;
},
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/auth.ts
git commit -m "feat(friends-v2): auto-create friendship from invite cookie on sign-in"
```

---

## Task 5: InviteShare component

**Files:**
- Create: `src/components/friends/InviteShare.tsx`

- [ ] **Step 1: Create the InviteShare component**

Create `src/components/friends/InviteShare.tsx`:

```tsx
'use client';

import { useState } from 'react';
import { Copy, Share2, Check, RefreshCw } from 'lucide-react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function InviteShare() {
  const { data, mutate } = useSWR('/api/invite/code', fetcher);
  const [copied, setCopied] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  const code = data?.code;
  const inviteUrl = typeof window !== 'undefined' && code
    ? `${window.location.origin}/invite/${code}`
    : '';

  async function handleCopy() {
    if (!inviteUrl) return;
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleShare() {
    if (!inviteUrl) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join me on Octokeen!',
          text: 'Practice mechanical engineering interview questions together.',
          url: inviteUrl,
        });
      } catch {
        // User cancelled share
      }
    } else {
      handleCopy();
    }
  }

  async function handleRegenerate() {
    setRegenerating(true);
    try {
      const res = await fetch('/api/invite/code/regenerate', { method: 'POST' });
      const data = await res.json();
      if (data.code) {
        mutate({ code: data.code }, false);
      }
    } finally {
      setRegenerating(false);
    }
  }

  if (!code) {
    return (
      <div className="rounded-2xl border border-surface-200 bg-white p-4 mb-5 animate-pulse">
        <div className="h-4 bg-surface-100 rounded w-1/2 mb-3" />
        <div className="h-10 bg-surface-100 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-primary-100 bg-gradient-to-br from-primary-50 to-white p-4 mb-5">
      <p className="text-xs font-bold text-primary-700 uppercase tracking-wider mb-2">
        Invite Friends
      </p>
      <p className="text-xs text-surface-500 mb-3">
        Share your link — they'll be added as your friend when they join.
      </p>

      <div className="flex gap-2">
        <div className="flex-1 flex items-center bg-white rounded-xl border border-surface-200 px-3 py-2 min-w-0">
          <span className="text-xs font-mono text-surface-600 truncate">
            {inviteUrl}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-surface-200 hover:bg-surface-50 transition-colors shrink-0"
          aria-label="Copy invite link"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : (
            <Copy className="w-4 h-4 text-surface-500" />
          )}
        </button>
        <button
          onClick={handleShare}
          className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary-600 text-white hover:bg-primary-700 transition-colors shrink-0"
          aria-label="Share invite link"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      <button
        onClick={handleRegenerate}
        disabled={regenerating}
        className="mt-2 text-[11px] font-semibold text-surface-400 hover:text-surface-600 transition-colors flex items-center gap-1 disabled:opacity-50"
      >
        <RefreshCw className={`w-3 h-3 ${regenerating ? 'animate-spin' : ''}`} />
        Regenerate link
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/friends/InviteShare.tsx
git commit -m "feat(friends-v2): add InviteShare component with copy/share/regenerate"
```

---

## Task 6: Update Friends page — remove search, add invite share

**Files:**
- Modify: `src/app/(app)/friends/page.tsx`
- Delete: `src/components/friends/UserSearch.tsx`
- Delete: `src/app/api/user/search/route.ts`

- [ ] **Step 1: Replace Friends page**

Rewrite `src/app/(app)/friends/page.tsx` — remove `UserSearch` import, add `InviteShare`, update empty state:

```tsx
'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, Users, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import InviteShare from '@/components/friends/InviteShare';
import FriendCard from '@/components/friends/FriendCard';
import FriendRequestCard from '@/components/friends/FriendRequestCard';
import useSWR from 'swr';

const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error(`Request failed: ${r.status}`);
    return r.json();
  });

export default function FriendsPage() {
  const [tab, setTab] = useState<'friends' | 'requests'>('friends');

  const {
    data: friendsData,
    isLoading: friendsLoading,
    mutate: mutateFriends,
  } = useSWR('/api/friends', fetcher);

  const {
    data: requestsData,
    isLoading: requestsLoading,
    mutate: mutateRequests,
  } = useSWR('/api/friends/requests', fetcher);

  const friends = friendsData?.friends ?? [];
  const incoming = requestsData?.incoming ?? [];
  const outgoing = requestsData?.outgoing ?? [];

  const handleAction = useCallback(() => {
    mutateFriends();
    mutateRequests();
  }, [mutateFriends, mutateRequests]);

  return (
    <div className="min-h-screen" style={{ background: '#FAFAFA' }}>
      <header
        className="sticky top-0 z-10 bg-white px-4 sm:px-5 py-3"
        style={{ borderBottom: '2px solid #E5E5E5' }}
      >
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center justify-center w-11 h-11 min-w-[44px] min-h-[44px] rounded-[10px] active:scale-90 transition-transform lg:hidden"
            style={{ background: '#F0F0F0' }}
          >
            <ChevronLeft style={{ width: 20, height: 20, color: '#3C3C3C' }} />
          </Link>
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold" style={{ color: '#3C3C3C' }}>Friends</h1>
            <p className="text-xs font-semibold" style={{ color: '#9CA3AF' }}>Study together, grow together</p>
          </div>
        </div>
      </header>

      <div className="px-4 sm:px-5 py-5 max-w-[600px] mx-auto">
        <InviteShare />

        <div className="flex gap-2 mb-5">
          <button
            onClick={() => setTab('friends')}
            className={`flex-1 min-h-[44px] py-2.5 rounded-xl text-sm font-bold transition-colors ${
              tab === 'friends'
                ? 'bg-primary-600 text-white'
                : 'bg-surface-100 text-surface-500 hover:bg-surface-200'
            }`}
          >
            Friends {friends.length > 0 && `(${friends.length})`}
          </button>
          <button
            onClick={() => setTab('requests')}
            className={`flex-1 min-h-[44px] py-2.5 rounded-xl text-sm font-bold transition-colors relative ${
              tab === 'requests'
                ? 'bg-primary-600 text-white'
                : 'bg-surface-100 text-surface-500 hover:bg-surface-200'
            }`}
          >
            Requests
            {incoming.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                {incoming.length}
              </span>
            )}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {tab === 'friends' ? (
            <motion.div
              key="friends"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.15 }}
            >
              {friendsLoading ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="w-6 h-6 animate-spin text-primary-400" />
                </div>
              ) : friends.length === 0 ? (
                <div className="card p-8 text-center" style={{ background: '#EEF2FF', borderColor: '#C7D2FE' }}>
                  <div className="flex justify-center mb-3">
                    <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
                      <Users className="w-8 h-8 text-primary-500" />
                    </div>
                  </div>
                  <p className="text-surface-700 font-bold text-sm mb-1">No friends yet</p>
                  <p className="text-surface-400 text-xs">
                    Share your invite link above to add friends!
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {friends.map((f: any, i: number) => (
                    <FriendCard key={f.id} {...f} index={i} />
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="requests"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
            >
              {requestsLoading ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="w-6 h-6 animate-spin text-primary-400" />
                </div>
              ) : incoming.length === 0 && outgoing.length === 0 ? (
                <div className="card p-8 text-center" style={{ background: '#F0FDF4', borderColor: '#BBF7D0' }}>
                  <div className="flex justify-center mb-3">
                    <span className="text-3xl">&#x2705;</span>
                  </div>
                  <p className="text-surface-700 font-bold text-sm">All caught up!</p>
                  <p className="text-surface-400 text-xs mt-1">No pending requests</p>
                </div>
              ) : (
                <>
                  {incoming.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-xs font-extrabold text-surface-400 uppercase tracking-wider mb-3">
                        Incoming ({incoming.length})
                      </h3>
                      <div className="flex flex-col gap-2">
                        {incoming.map((req: any, i: number) => (
                          <FriendRequestCard
                            key={req.id}
                            id={req.id}
                            userId={req.senderId}
                            displayName={req.senderName ?? 'Unknown'}
                            image={req.senderImage}
                            level={req.senderLevel ?? 1}
                            type="incoming"
                            onAction={handleAction}
                            index={i}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  {outgoing.length > 0 && (
                    <div>
                      <h3 className="text-xs font-extrabold text-surface-400 uppercase tracking-wider mb-3">
                        Sent ({outgoing.length})
                      </h3>
                      <div className="flex flex-col gap-2">
                        {outgoing.map((req: any, i: number) => (
                          <FriendRequestCard
                            key={req.id}
                            id={req.id}
                            userId={req.receiverId}
                            displayName={req.receiverName ?? 'Unknown'}
                            image={req.receiverImage}
                            level={req.receiverLevel ?? 1}
                            type="outgoing"
                            onAction={handleAction}
                            index={i}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Delete UserSearch and search API**

```bash
rm src/components/friends/UserSearch.tsx
rm src/app/api/user/search/route.ts
```

- [ ] **Step 3: Commit**

```bash
git add src/app/\(app\)/friends/page.tsx src/components/friends/UserSearch.tsx src/app/api/user/search/route.ts
git commit -m "feat(friends-v2): replace user search with invite share on friends page"
```

---

## Task 7: Update Friends API — add todayXp

**Files:**
- Modify: `src/app/api/friends/route.ts`

- [ ] **Step 1: Add todayXp to friends response**

In `src/app/api/friends/route.ts`, add import for `sessionHistory` and `sql`:

```typescript
import { friendships, users, userProgress, leagueState, sessionHistory } from '@/lib/db/schema';
import { eq, or, inArray, desc, and, sql } from 'drizzle-orm';
```

**IMPORTANT:** Preserve the existing early return for empty `friendIds` (lines 20-22 of current file). The code below replaces everything AFTER that guard (from the `friends` query to the response):

```typescript
  const friends = await db
    .select({
      id: users.id,
      displayName: users.displayName,
      image: users.image,
      level: userProgress.currentLevel,
      currentStreak: userProgress.currentStreak,
      totalXp: userProgress.totalXp,
      leagueTier: leagueState.tier,
    })
    .from(users)
    .leftJoin(userProgress, eq(users.id, userProgress.userId))
    .leftJoin(leagueState, eq(users.id, leagueState.userId))
    .where(inArray(users.id, friendIds))
    .orderBy(desc(userProgress.totalXp));

  // Get today's XP for all friends in one query
  const today = new Date().toISOString().split('T')[0];
  const todayXpRows = await db
    .select({
      userId: sessionHistory.userId,
      todayXp: sql<number>`coalesce(sum(${sessionHistory.xpEarned}), 0)::int`,
    })
    .from(sessionHistory)
    .where(and(inArray(sessionHistory.userId, friendIds), eq(sessionHistory.date, today)))
    .groupBy(sessionHistory.userId);

  const todayXpMap = new Map(todayXpRows.map((r) => [r.userId, r.todayXp]));

  const result = friends.map((f) => ({
    id: f.id,
    displayName: f.displayName ?? 'Unknown',
    image: f.image ?? null,
    level: f.level ?? 1,
    currentStreak: f.currentStreak ?? 0,
    totalXp: f.totalXp ?? 0,
    leagueTier: f.leagueTier ?? 1,
    todayXp: todayXpMap.get(f.id) ?? 0,
  }));

  return NextResponse.json({ friends: result });
```

- [ ] **Step 2: Commit**

```bash
git add src/app/api/friends/route.ts
git commit -m "feat(friends-v2): add todayXp to friends API response"
```

---

## Task 8: Update FriendCard — activity snippets

**Files:**
- Modify: `src/components/friends/FriendCard.tsx`

- [ ] **Step 1: Add todayXp prop and activity subtitle**

Replace the full `FriendCard.tsx` content:

```tsx
'use client';

import Link from 'next/link';
import { Flame, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface FriendCardProps {
  id: string;
  displayName: string;
  image: string | null;
  level: number;
  currentStreak: number;
  totalXp: number;
  todayXp?: number;
  index: number;
}

function getActivitySnippet(streak: number, todayXp: number, level: number): string {
  if (streak >= 3) return `On a ${streak}-day streak`;
  if (todayXp > 0) return `Earned ${todayXp} XP today`;
  return `Level ${level}`;
}

export default function FriendCard({
  id,
  displayName,
  image,
  level,
  currentStreak,
  totalXp,
  todayXp = 0,
  index,
}: FriendCardProps) {
  const initials = (displayName || '?').charAt(0).toUpperCase();
  const subtitle = getActivitySnippet(currentStreak, todayXp, level);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link
        href={`/user/${id}`}
        className="card-hover flex items-center gap-3 p-4"
      >
        <div
          className="rounded-full flex items-center justify-center overflow-hidden shrink-0"
          style={{ width: 44, height: 44, background: '#E0E7FF' }}
        >
          {image ? (
            <img src={image} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="text-primary-700 font-bold text-sm">{initials}</span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-surface-900 truncate">{displayName}</p>
          <p className="text-xs text-surface-400 font-semibold">{subtitle}</p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-bold text-surface-700">{currentStreak}</span>
          </div>
          <div className="flex items-center gap-1">
            <Zap className="w-4 h-4 text-primary-500" />
            <span className="text-sm font-bold text-surface-700">{totalXp.toLocaleString()}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/friends/FriendCard.tsx
git commit -m "feat(friends-v2): add activity snippets to friend cards"
```

---

## Task 9: Friend leaderboard — weekly XP API

**Files:**
- Create: `src/app/api/friends/weekly-xp/route.ts`

- [ ] **Step 1: Create the weekly XP endpoint**

Create `src/app/api/friends/weekly-xp/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { getAuthUserId } from '@/lib/auth-utils';
import { db } from '@/lib/db';
import { friendships, users, sessionHistory } from '@/lib/db/schema';
import { eq, or, inArray, and, gte, sql } from 'drizzle-orm';

function getWeekStart(): string {
  const now = new Date();
  const day = now.getUTCDay(); // 0=Sun..6=Sat
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setUTCDate(now.getUTCDate() + diff);
  return monday.toISOString().split('T')[0];
}

export async function GET() {
  const userId = await getAuthUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get friend IDs
  const rows = await db
    .select({ usrId: friendships.userId, frnId: friendships.friendId })
    .from(friendships)
    .where(or(eq(friendships.userId, userId), eq(friendships.friendId, userId)));

  const friendIds = rows.map((r) => (r.usrId === userId ? r.frnId : r.usrId));
  const allIds = [userId, ...friendIds];

  const weekStart = getWeekStart();

  // Get weekly XP for all users (user + friends)
  const xpRows = await db
    .select({
      userId: sessionHistory.userId,
      weeklyXp: sql<number>`coalesce(sum(${sessionHistory.xpEarned}), 0)::int`,
    })
    .from(sessionHistory)
    .where(and(inArray(sessionHistory.userId, allIds), gte(sessionHistory.date, weekStart)))
    .groupBy(sessionHistory.userId);

  const xpMap = new Map(xpRows.map((r) => [r.userId, r.weeklyXp]));

  // Get user details
  const userRows = await db
    .select({
      id: users.id,
      displayName: users.displayName,
      image: users.image,
    })
    .from(users)
    .where(inArray(users.id, allIds));

  const leaderboard = userRows
    .map((u) => ({
      id: u.id,
      displayName: u.displayName ?? 'Unknown',
      image: u.image ?? null,
      weeklyXp: xpMap.get(u.id) ?? 0,
      isUser: u.id === userId,
    }))
    .sort((a, b) => b.weeklyXp - a.weeklyXp);

  return NextResponse.json({ leaderboard });
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/api/friends/weekly-xp/route.ts
git commit -m "feat(friends-v2): add weekly XP API for friend leaderboard"
```

---

## Task 10: Friend leaderboard UI + League page tabs

**Files:**
- Create: `src/components/engagement/FriendLeaderboard.tsx`
- Modify: `src/app/(app)/league/page.tsx`

- [ ] **Step 1: Create FriendLeaderboard component**

Create `src/components/engagement/FriendLeaderboard.tsx`:

```tsx
'use client';

import { Users } from 'lucide-react';
import useSWR from 'swr';
import InviteShare from '@/components/friends/InviteShare';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface LeaderboardEntry {
  id: string;
  displayName: string;
  image: string | null;
  weeklyXp: number;
  isUser: boolean;
}

export function FriendLeaderboard() {
  const { data, isLoading } = useSWR('/api/friends/weekly-xp', fetcher);
  const leaderboard: LeaderboardEntry[] = data?.leaderboard ?? [];

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex justify-center">
        <div className="w-6 h-6 border-2 border-gray-300 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (leaderboard.length <= 1) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 text-center">
          <div className="flex justify-center mb-3">
            <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
              <Users className="w-8 h-8 text-primary-500" />
            </div>
          </div>
          <p className="text-surface-700 font-bold text-sm mb-1">No friends yet</p>
          <p className="text-surface-400 text-xs mb-4">
            Invite friends to see how you stack up!
          </p>
          <InviteShare />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-4 py-4 flex items-center gap-3 border-b border-gray-100 bg-primary-50/50">
        <span className="text-3xl">👥</span>
        <div>
          <h2 className="text-lg font-extrabold text-gray-800">Friends Leaderboard</h2>
          <p className="text-xs text-gray-500">Weekly XP ranking</p>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="overflow-y-auto" style={{ maxHeight: 480 }}>
        {leaderboard.map((entry, idx) => {
          const rank = idx + 1;
          const isTop3 = rank <= 3;
          const initials = (entry.displayName || '?').charAt(0).toUpperCase();

          return (
            <div
              key={entry.id}
              className={`flex items-center gap-2.5 px-4 border-b border-gray-50 last:border-0 ${
                isTop3 ? 'py-3' : 'py-2.5'
              }`}
              style={{ background: entry.isUser ? '#EEF2FF' : 'transparent' }}
            >
              {/* Rank */}
              <span
                className={`font-bold text-center flex-shrink-0 ${isTop3 ? 'text-base w-7' : 'text-sm w-6'}`}
                style={{
                  color: rank === 1 ? '#F59E0B' : rank === 2 ? '#9CA3AF' : rank === 3 ? '#CD7F32' : '#D1D5DB',
                }}
              >
                {rank === 1 ? '\u{1F947}' : rank === 2 ? '\u{1F948}' : rank === 3 ? '\u{1F949}' : rank}
              </span>

              {/* Avatar */}
              <div
                className="rounded-full flex items-center justify-center overflow-hidden shrink-0"
                style={{
                  width: isTop3 ? 36 : 32,
                  height: isTop3 ? 36 : 32,
                  background: entry.isUser ? '#C7D2FE' : '#E0E7FF',
                }}
              >
                {entry.image ? (
                  <img src={entry.image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-primary-700 font-bold text-xs">{initials}</span>
                )}
              </div>

              {/* Name */}
              <div className="flex-1 min-w-0 flex items-center gap-1.5">
                <span
                  className="text-sm font-semibold truncate"
                  style={{ color: entry.isUser ? '#4F46E5' : '#374151' }}
                >
                  {entry.displayName}
                </span>
                {entry.isUser && (
                  <span className="flex-shrink-0 text-[10px] font-bold uppercase tracking-wide text-indigo-600 bg-indigo-100 px-1.5 py-0.5 rounded-full">
                    You
                  </span>
                )}
              </div>

              {/* XP */}
              <span className="text-sm font-bold text-gray-600 min-w-[60px] text-right">
                {entry.weeklyXp} XP
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Add tabs to League page**

Replace `src/app/(app)/league/page.tsx`:

```tsx
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { LeagueBoard } from '@/components/engagement/LeagueBoard';
import { LeaguePromotion } from '@/components/engagement/LeaguePromotion';
import { FriendLeaderboard } from '@/components/engagement/FriendLeaderboard';

function getWeekDateRange(): string {
  const now = new Date();
  const day = now.getUTCDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setUTCDate(now.getUTCDate() + diffToMonday);
  const sunday = new Date(monday);
  sunday.setUTCDate(monday.getUTCDate() + 6);

  const fmt = (d: Date) =>
    d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return `${fmt(monday)} – ${fmt(sunday)}`;
}

export default function LeaguePage() {
  const weekRange = useMemo(() => getWeekDateRange(), []);
  const [tab, setTab] = useState<'league' | 'friends'>('league');

  return (
    <div className="min-h-screen" style={{ background: '#FAFAFA' }}>
      {/* Header */}
      <header
        className="sticky top-0 z-30 bg-white px-4 sm:px-5 py-3"
        style={{ borderBottom: '2px solid #E5E5E5' }}
      >
        <div className="flex items-center gap-3 max-w-2xl mx-auto">
          <Link
            href="/"
            className="flex items-center justify-center w-11 h-11 min-w-[44px] min-h-[44px] rounded-[10px] transition-transform active:scale-90 lg:hidden"
            style={{ background: '#F0F0F0' }}
          >
            <ChevronLeft style={{ width: 20, height: 20, color: '#777' }} />
          </Link>
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold" style={{ color: '#3C3C3C', lineHeight: 1.2 }}>
              Leaderboard
            </h1>
            <p className="text-xs font-semibold mt-px" style={{ color: '#AFAFAF' }}>
              {weekRange}
            </p>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="px-4 sm:px-5 pt-4 max-w-2xl mx-auto">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setTab('league')}
            className={`flex-1 min-h-[44px] py-2.5 rounded-xl text-sm font-bold transition-colors ${
              tab === 'league'
                ? 'bg-primary-600 text-white'
                : 'bg-surface-100 text-surface-500 hover:bg-surface-200'
            }`}
          >
            League
          </button>
          <button
            onClick={() => setTab('friends')}
            className={`flex-1 min-h-[44px] py-2.5 rounded-xl text-sm font-bold transition-colors ${
              tab === 'friends'
                ? 'bg-primary-600 text-white'
                : 'bg-surface-100 text-surface-500 hover:bg-surface-200'
            }`}
          >
            Friends
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-5 pb-8 max-w-2xl mx-auto">
        {tab === 'league' ? (
          <>
            <LeagueBoard />
            <LeaguePromotion />
          </>
        ) : (
          <FriendLeaderboard />
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/engagement/FriendLeaderboard.tsx src/app/\(app\)/league/page.tsx
git commit -m "feat(friends-v2): add friend leaderboard with tabs on league page"
```

---

## Task 11: Remove AddFriendButton from user profile and delete component

**Files:**
- Modify: `src/app/(app)/user/[id]/page.tsx`
- Delete: `src/components/friends/AddFriendButton.tsx`

- [ ] **Step 1: Remove AddFriendButton import and usage**

In `src/app/(app)/user/[id]/page.tsx`:
- Remove the import: `import AddFriendButton from '@/components/friends/AddFriendButton';`
- Remove the `<AddFriendButton ... />` usage from the JSX (find it in the profile header area)
- Keep the rest of the profile page intact

- [ ] **Step 2: Delete AddFriendButton component**

```bash
rm src/components/friends/AddFriendButton.tsx
```

- [ ] **Step 3: Commit**

```bash
git add src/app/\(app\)/user/\[id\]/page.tsx src/components/friends/AddFriendButton.tsx
git commit -m "feat(friends-v2): remove AddFriendButton — friends only via invite links"
```

---

## Task 12: Smoke test the full flow

- [ ] **Step 1: Verify the dev server runs**

```bash
npx next dev --turbopack
```

Open `http://localhost:3000` — confirm no console errors.

- [ ] **Step 2: Test invite code generation**

Log in, go to `/friends`. Verify the InviteShare card appears with a generated link. Click "Copy Link" — verify it copies. Click "Regenerate" — verify a new link appears.

- [ ] **Step 3: Test invite landing page**

Open the copied invite link in an incognito window. Verify it shows the inviter's name and "Join Octokeen" CTA.

- [ ] **Step 4: Test league Friends tab**

Go to `/league`. Verify the League/Friends tabs appear. Click "Friends" — verify the leaderboard or empty state shows.

- [ ] **Step 5: Test friend card activity snippets**

If you have friends, verify the friend cards show dynamic subtitles (streak, today's XP, or level).
