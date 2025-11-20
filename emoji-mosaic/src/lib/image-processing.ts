import { type EmojiSetKey } from './emoji-data';
import { rgbToOklch, oklchDistance } from './color-utils';
import { emojiCacheManager } from './emoji-cache';

/**
 * Options for mosaic generation
 */
export interface MosaicOptions {
  density: number; // 10-50, controls block size
  onProgress?: (progress: number) => void; // Progress callback (0-100)
}

/**
 * Generate an emoji mosaic from an image
 */
export async function generateMosaic(
  imageSrc: string,
  setKey: EmojiSetKey,
  options: MosaicOptions
): Promise<string> {
  const { density, onProgress } = options;

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    
    img.onload = async () => {
      try {
        // Get emoji color cache
        const cache = await emojiCacheManager.getCache(setKey);
        const emojiData = cache.getAll();

        if (emojiData.length === 0) {
          console.error('No emoji data available');
          resolve('');
          return;
        }

        // Setup canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;

        // Resize for performance
        const MAX_WIDTH = 1200;
        const scale = Math.min(1, MAX_WIDTH / img.width);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Calculate block size
        const blockSize = Math.max(5, Math.floor(50 - (density * 0.8)));

        // Create output canvas
        const mosaicCanvas = document.createElement('canvas');
        mosaicCanvas.width = canvas.width;
        mosaicCanvas.height = canvas.height;
        const mosaicCtx = mosaicCanvas.getContext('2d')!;

        // Simple greyscale background for structure
        mosaicCtx.filter = 'grayscale(100%)';
        mosaicCtx.globalAlpha = 0.25;
        mosaicCtx.drawImage(img, 0, 0, canvas.width, canvas.height);
        mosaicCtx.filter = 'none';
        mosaicCtx.globalAlpha = 1.0;

        // Setup emoji rendering
        mosaicCtx.font = `${blockSize * 1.1}px sans-serif`;
        mosaicCtx.textAlign = 'center';
        mosaicCtx.textBaseline = 'middle';
        mosaicCtx.fillStyle = '#ffffff';

        // Track emoji usage for diversity
        const usageCount  = new Map<string, number>();
        for (const emoji of emojiData) {
          usageCount.set(emoji.char, 0);
        }

        const totalBlocks = Math.ceil(canvas.height / blockSize) * Math.ceil(canvas.width / blockSize);
        let processedBlocks = 0;

        // Process image in blocks
        const processRow = async (y: number) => {
          for (let x = 0; x < canvas.width; x += blockSize) {
            // Get average color of this block
            const blockWidth = Math.min(blockSize, canvas.width - x);
            const blockHeight = Math.min(blockSize, canvas.height - y);
            const imageData = ctx.getImageData(x, y, blockWidth, blockHeight);
            const data = imageData.data;

            let r = 0, g = 0, b = 0, count = 0;
            for (let i = 0; i < data.length; i += 4) {
              r += data[i];
              g += data[i + 1];
              b += data[i + 2];
              count++;
            }

            if (count > 0) {
              r = Math.round(r / count);
              g = Math.round(g / count);
              b = Math.round(b / count);

              const targetColor = rgbToOklch(r, g, b);

              // Find best matching emoji using OKLCH distance
              let bestEmoji = emojiData[0];
              let minDistance = Infinity;

              for (const emoji of emojiData) {
                const distance = oklchDistance(targetColor, emoji.oklch);
                
                // Apply small diversity penalty to avoid repetition
                const usage = usageCount.get(emoji.char) || 0;
                const diversityPenalty = usage * 0.02;
                const score = distance + diversityPenalty;

                if (score < minDistance) {
                  minDistance = score;
                  bestEmoji = emoji;
                }
              }

              // Draw the emoji
              mosaicCtx.fillText(
                bestEmoji.char,
                x + blockSize / 2,
                y + blockSize / 2
              );

              // Increment usage count
              usageCount.set(bestEmoji.char, (usageCount.get(bestEmoji.char) || 0) + 1);
            }

            processedBlocks++;
          }

          // Report progress
          if (onProgress) {
            const progress = Math.round((processedBlocks / totalBlocks) * 100);
            onProgress(progress);
          }
        };

        // Process all rows with periodic yields
        for (let y = 0; y < canvas.height; y += blockSize) {
          await processRow(y);

          // Yield to event loop every 5 rows
          if ((y / blockSize) % 5 === 0) {
            await new Promise(resolve => setTimeout(resolve, 0));
          }
        }

        resolve(mosaicCanvas.toDataURL('image/png'));
      } catch (error) {
        console.error('Mosaic generation failed:', error);
        resolve('');
      }
    };

    img.onerror = () => {
      console.error('Failed to load image');
      resolve('');
    };

    img.src = imageSrc;
  });
}
