import { NextResponse } from 'next/server';

// Digital Asset Links for Android TWA (Trusted Web Activity).
// Verifies that the Android app is authorized to open octokeen.com without a browser chrome bar.
//
// ANDROID_SHA256_FINGERPRINT accepts a comma-separated list. List the Play App Signing
// certificate (Play Console -> Setup -> App signing) first. Add the upload certificate too if
// you want locally-built or internal-app-sharing bundles to verify as well.
// Read a local keystore's fingerprint with:
//   keytool -list -v -keystore android/android.keystore -alias octokeen | grep SHA256

const PLACEHOLDER = 'TODO:REPLACE_WITH_ACTUAL_FINGERPRINT';

function fingerprints(): string[] {
  const raw = process.env.ANDROID_SHA256_FINGERPRINT;
  if (!raw) return [PLACEHOLDER];

  const parsed = raw
    .split(',')
    .map((fp) => fp.trim().toUpperCase())
    .filter(Boolean);

  return parsed.length > 0 ? parsed : [PLACEHOLDER];
}

export async function GET() {
  const assetLinks = [
    {
      relation: ['delegate_permission/common.handle_all_urls'],
      target: {
        namespace: 'android_app',
        package_name: process.env.ANDROID_PACKAGE_NAME || 'com.octokeen.app',
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
