import type { Metadata, Viewport } from 'next';

import { Nunito, JetBrains_Mono } from 'next/font/google';
import { AuthSessionProvider } from '@/components/providers/SessionProvider';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import MixpanelProvider from '@/components/providers/MixpanelProvider';
import CookieConsent from '@/components/ui/CookieConsent';
import { DebugTierToggle } from '@/components/dev/DebugTierToggle';
import { FlowLogger } from '@/components/dev/FlowLogger';
import { Suspense } from 'react';
import { APP_NAME, APP_URL, APP_DOMAIN, APP_TAGLINE, APP_DESCRIPTION, APP_THEME_COLOR, APP_THEME_COLOR_LIGHT, APP_THEME_COLOR_DARK } from '@/lib/constants';
import {
  DEFAULT_OG_IMAGE_HEIGHT,
  DEFAULT_OG_IMAGE_PATH,
  DEFAULT_OG_IMAGE_WIDTH,
  DEFAULT_OG_LOCALE,
} from '@/lib/seo/constants';
import {
  buildJsonLdGraph,
  buildOrganizationJsonLd,
  buildWebApplicationJsonLd,
  buildWebSiteJsonLd,
} from '@/lib/seo/structured-data';
import './globals.css';
import { TWA_DETECT_SCRIPT, TWA_ROOT_ATTRIBUTE } from '@/lib/twa-constants';

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: APP_THEME_COLOR,
};

const DEFAULT_TITLE = `${APP_NAME} | ${APP_TAGLINE}`;

/** Shared social card. Pages that want their own pass `images` themselves. */
const DEFAULT_OG_IMAGE = {
  url: DEFAULT_OG_IMAGE_PATH,
  width: DEFAULT_OG_IMAGE_WIDTH,
  height: DEFAULT_OG_IMAGE_HEIGHT,
  alt: DEFAULT_TITLE,
};

export const metadata: Metadata = {
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  metadataBase: new URL(APP_URL),
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/icon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  keywords: ['gamified learning', 'personal finance', 'psychology', 'space and astronomy', 'daily lessons', 'adaptive learning', 'online education', 'learn in 5 minutes'],
  authors: [{ name: APP_NAME }],
  creator: APP_NAME,
  openGraph: {
    title: DEFAULT_TITLE,
    description: APP_DESCRIPTION,
    url: APP_URL,
    siteName: APP_NAME,
    type: 'website',
    locale: DEFAULT_OG_LOCALE,
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    images: [DEFAULT_OG_IMAGE],
    title: DEFAULT_TITLE,
    description: APP_DESCRIPTION,
  },
  alternates: {
    canonical: APP_URL,
  },
  other: {
    'google-adsense-account': 'ca-pub-3282358085183080',
  },
};

/**
 * One site-wide `@graph`. The `Organization` node carries the `@id` that every
 * `Course` node's `provider` reference points at, so emitting it from the root
 * layout is what makes that reference resolve on every page.
 *
 * No `FAQPage`: it used to live here, which put FAQ markup on all 25 URLs when
 * only /pricing shows any. Google retired FAQ rich results on 2025-06-15, so
 * the markup had no upside left and a structured-data-spam downside.
 */
const jsonLd = buildJsonLdGraph([
  buildOrganizationJsonLd(),
  buildWebSiteJsonLd(),
  buildWebApplicationJsonLd(),
]);

/**
 * The service worker caches responses, which is useful in production and
 * actively harmful in development: Turbopack serves changed CSS and JS behind
 * stable chunk URLs, so a cached copy pins the app to whatever the browser saw
 * first. Register it only in production, and tear down any registration (plus
 * its caches) left behind on a dev machine.
 */
const SERVICE_WORKER_SCRIPT =
  process.env.NODE_ENV === 'production'
    ? `if('serviceWorker' in navigator)navigator.serviceWorker.register('/sw.js')`
    : `if('serviceWorker' in navigator){navigator.serviceWorker.getRegistrations().then(function(rs){rs.forEach(function(r){r.unregister()})});if(window.caches)caches.keys().then(function(ks){ks.forEach(function(k){caches.delete(k)})})}`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${nunito.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body className="min-h-screen">
        {/* Prevent FOUC: apply dark class before first paint */}
        <script
          dangerouslySetInnerHTML={{ __html: `(function(){try{var d=JSON.parse(localStorage.getItem('octokeen-theme')||'{}');var m=d&&d.state&&d.state.mode;var dk=m==='dark'||(m==='system'&&matchMedia('(prefers-color-scheme:dark)').matches);if(dk){document.documentElement.classList.add('dark');var t=document.querySelector('meta[name="theme-color"]');if(t)t.setAttribute('content','${APP_THEME_COLOR_DARK}')}}catch(e){}})()` }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{ __html: SERVICE_WORKER_SCRIPT }}
        />
        <script dangerouslySetInnerHTML={{ __html: TWA_DETECT_SCRIPT }} />
        <script
          dangerouslySetInnerHTML={{ __html: `
            (function(){
              if(document.documentElement.hasAttribute('${TWA_ROOT_ATTRIBUTE}'))return;
              var s=document.createElement('script');
              s.async=true;
              s.crossOrigin='anonymous';
              s.src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3282358085183080';
              document.head.appendChild(s);
            })();
          ` }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded-lg focus:text-sm focus:font-bold"
        >
          Skip to main content
        </a>
        <AuthSessionProvider>
          <ThemeProvider>
            <MixpanelProvider>
              {children}
            </MixpanelProvider>
            <CookieConsent />
            <DebugTierToggle />
            <Suspense><FlowLogger /></Suspense>
          </ThemeProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
