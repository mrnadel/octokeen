import { NextResponse } from 'next/server';

// Digital Asset Links for the Android TWA (Trusted Web Activity).
// Verifies that the Android app may render octokeen.com without browser chrome.
//
// These fingerprints are not secrets - the endpoint that serves them is public,
// and Chrome fetches it over the open internet on every install. They are baked
// in so a deploy cannot silently lose them; ANDROID_SHA256_FINGERPRINT still
// overrides with a comma-separated list if the signing setup ever changes.

const PACKAGE_NAME = 'com.octokeen.app';

const DEFAULT_FINGERPRINTS = [
  // Play App Signing certificate. Play strips our signature and re-signs with
  // this key, so it is the one that matters for every install from the store.
  // Play Console -> Test and release -> Setup -> App signing.
  'E5:0F:BF:69:8F:77:BA:66:1F:48:DE:91:85:4A:C6:D7:4D:0E:96:9B:6B:F3:6C:D8:AB:1F:8F:46:AD:C7:14:57',
  // Upload certificate from android/android.keystore. Covers locally built and
  // internal-app-sharing bundles, which never pass through Play's re-signing.
  '08:92:66:D6:8E:BB:8D:8A:6B:2B:97:54:65:C0:9F:29:20:BD:66:94:81:E9:2D:4B:88:94:7E:9C:DF:AF:F5:57',
];

function fingerprints(): string[] {
  const parsed = (process.env.ANDROID_SHA256_FINGERPRINT ?? '')
    .split(',')
    .map((fp) => fp.trim().toUpperCase())
    .filter(Boolean);

  return parsed.length > 0 ? parsed : DEFAULT_FINGERPRINTS;
}

export async function GET() {
  const assetLinks = [
    {
      relation: ['delegate_permission/common.handle_all_urls'],
      target: {
        namespace: 'android_app',
        package_name: process.env.ANDROID_PACKAGE_NAME || PACKAGE_NAME,
        sha256_cert_fingerprints: fingerprints(),
      },
    },
  ];

  return NextResponse.json(assetLinks, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
