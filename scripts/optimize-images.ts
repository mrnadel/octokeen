import sharp from 'sharp';
import { glob } from 'glob';
import path from 'path';
import fs from 'fs/promises';

const QUALITY = 75;

async function optimizePng(filePath: string) {
  const stats = await fs.stat(filePath);
  const originalSize = stats.size;

  const buffer = await sharp(filePath)
    .png({ quality: QUALITY, compressionLevel: 9, palette: true })
    .toBuffer();

  if (buffer.length < originalSize) {
    await fs.writeFile(filePath, buffer);
    const savings = Math.round((1 - buffer.length / originalSize) * 100);
    console.log(`✓ ${path.basename(filePath)}: ${Math.round(originalSize / 1024)}KB → ${Math.round(buffer.length / 1024)}KB (-${savings}%)`);
  } else {
    console.log(`  ${path.basename(filePath)}: already optimal`);
  }
}

async function main() {
  const files = await glob('public/**/*.png');
  console.log(`Found ${files.length} PNG files`);
  await Promise.all(files.map(optimizePng));
  console.log('Image optimization complete.');
}

main().catch(console.error);
