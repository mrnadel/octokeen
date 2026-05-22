import sharp from 'sharp';
import { glob } from 'glob';
import path from 'path';
import fs from 'fs/promises';

const QUALITY = 75;
const CONCURRENCY = 8;

interface OptimizationStats {
  totalBefore: number;
  totalAfter: number;
  optimized: number;
}

const stats: OptimizationStats = {
  totalBefore: 0,
  totalAfter: 0,
  optimized: 0,
};

async function optimizePng(filePath: string) {
  try {
    const fileStats = await fs.stat(filePath);
    const originalSize = fileStats.size;

    const buffer = await sharp(filePath)
      .png({ quality: QUALITY, compressionLevel: 9, palette: true })
      .toBuffer();

    stats.totalBefore += originalSize;
    stats.totalAfter += buffer.length;

    if (buffer.length < originalSize) {
      await fs.writeFile(filePath, buffer);
      const savings = Math.round((1 - buffer.length / originalSize) * 100);
      console.log(`✓ ${path.basename(filePath)}: ${Math.round(originalSize / 1024)}KB → ${Math.round(buffer.length / 1024)}KB (-${savings}%)`);
      stats.optimized++;
    } else {
      console.log(`  ${path.basename(filePath)}: already optimal`);
    }
  } catch (error) {
    console.warn(`✗ ${path.basename(filePath)}: ${(error as Error).message}`);
  }
}

async function main() {
  const files = await glob('public/**/*.png');
  console.log(`Found ${files.length} PNG files`);

  // Process files with concurrency limiting
  for (let i = 0; i < files.length; i += CONCURRENCY) {
    await Promise.all(files.slice(i, i + CONCURRENCY).map(optimizePng));
  }

  // Print summary statistics
  const pct = stats.totalBefore > 0 ? Math.round((1 - stats.totalAfter / stats.totalBefore) * 100) : 0;
  console.log(`\nOptimized ${stats.optimized}/${files.length} files: ${Math.round(stats.totalBefore / 1024)}KB → ${Math.round(stats.totalAfter / 1024)}KB (-${pct}%)`);
  console.log('Image optimization complete.');
}

main().catch(console.error);
