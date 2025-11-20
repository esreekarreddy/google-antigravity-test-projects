/**
 * Color utility functions for accurate emoji color matching
 * Uses OKLCH color space for perceptually uniform color distances
 */

// OKLCH Color type [Lightness, Chroma, Hue]
export type OKLCHColor = [number, number, number];
export type RGBColor = [number, number, number];

/**
 * Convert RGB to linear RGB (gamma correction)
 */
function rgbToLinear(channel: number): number {
  const c = channel / 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

/**
 * Convert linear RGB to OKLAB
 * OKLAB is an intermediate step to OKLCH
 */
function linearRgbToOklab(r: number, g: number, b: number): [number, number, number] {
  // Matrix transformation from linear RGB to LMS cone space
  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;

  // Convert to OKLAB
  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);

  return [
    0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_,
    1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_,
    0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_,
  ];
}

/**
 * Convert RGB [0-255] to OKLCH color space
 * Returns [Lightness 0-1, Chroma 0-0.4, Hue 0-360]
 */
export function rgbToOklch(r: number, g: number, b: number): OKLCHColor {
  // Convert to linear RGB
  const lr = rgbToLinear(r);
  const lg = rgbToLinear(g);
  const lb = rgbToLinear(b);

  // Convert to OKLAB
  const [L, a, b_] = linearRgbToOklab(lr, lg, lb);

  // Convert OKLAB to OKLCH (cylindrical coordinates)
  const C = Math.sqrt(a * a + b_ * b_);
  let H = Math.atan2(b_, a) * (180 / Math.PI);
  if (H < 0) H += 360;

  return [L, C, H];
}

/**
 * Calculate perceptual color difference between two OKLCH colors
 * Uses weighted Euclidean distance
 * 
 * @param c1 First OKLCH color
 * @param c2 Second OKLCH color
 * @param weights Optional weights [L, C, H], defaults to [0.2, 0.7, 0.1]
 */
export function oklchDistance(
  c1: OKLCHColor,
  c2: OKLCHColor,
  weights: [number, number, number] = [0.2, 0.7, 0.1]
): number {
  const [L1, C1, H1] = c1;
  const [L2, C2, H2] = c2;
  const [wL, wC, wH] = weights;

  // Lightness difference
  const dL = (L1 - L2) * wL;

  // Chroma difference
  const dC = (C1 - C2) * wC;

  // Hue difference (circular, so we need to handle wrapping)
  let dH = Math.abs(H1 - H2);
  if (dH > 180) dH = 360 - dH;
  // Normalize hue to same scale as other components (0-1)
  dH = (dH / 180) * wH;

  return Math.sqrt(dL * dL + dC * dC + dH * dH);
}

/**
 * Render an emoji to a canvas and extract its average color
 * Samples multiple points to get a representative color
 */
export function getEmojiColor(emoji: string, size: number = 32): OKLCHColor {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;

  // Clear canvas
  ctx.clearRect(0, 0, size, size);

  // Draw emoji
  ctx.font = `${size * 0.8}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(emoji, size / 2, size / 2);

  // Sample multiple points (3x3 grid)
  const samplePoints = [
    [size / 4, size / 4],
    [size / 2, size / 4],
    [(3 * size) / 4, size / 4],
    [size / 4, size / 2],
    [size / 2, size / 2],
    [(3 * size) / 4, size / 2],
    [size / 4, (3 * size) / 4],
    [size / 2, (3 * size) / 4],
    [(3 * size) / 4, (3 * size) / 4],
  ];

  let totalR = 0, totalG = 0, totalB = 0, count = 0;

  for (const [x, y] of samplePoints) {
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const alpha = pixel[3];
    
    // Only count pixels that are not transparent
    if (alpha > 50) {
      totalR += pixel[0];
      totalG += pixel[1];
      totalB += pixel[2];
      count++;
    }
  }

  // If no pixels were sampled (fully transparent emoji), default to white
  if (count === 0) {
    return rgbToOklch(255, 255, 255);
  }

  const avgR = Math.round(totalR / count);
  const avgG = Math.round(totalG / count);
  const avgB = Math.round(totalB / count);

  return rgbToOklch(avgR, avgG, avgB);
}
