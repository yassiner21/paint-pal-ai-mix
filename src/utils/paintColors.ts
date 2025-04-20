export interface PaintColor {
  name: string;
  hex: string;
  type: string;
}

// Standard base colors used by painters
export const paintColors: PaintColor[] = [
  { name: "Cyan", hex: "#00B7EB", type: "primary" },
  { name: "Magenta", hex: "#FF00FF", type: "primary" },
  { name: "Yellow", hex: "#FFF200", type: "primary" },
  { name: "White", hex: "#FFFFFF", type: "neutral" },
  { name: "Black", hex: "#000000", type: "neutral" },
];

// Helper function to convert hex to RGB
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  hex = hex.replace(/^#/, '');
  const bigint = parseInt(hex, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  };
}

// Helper function to convert RGB to hex
export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + 
    Math.round(r).toString(16).padStart(2, '0') +
    Math.round(g).toString(16).padStart(2, '0') +
    Math.round(b).toString(16).padStart(2, '0');
}

// Convert RGB to HSL
export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }

    h /= 6;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

// Convert HSL to RGB
export function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h /= 360;
  s /= 100;
  l /= 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

// Convert RGB to XYZ color space
function rgbToXyz(r: number, g: number, b: number): { x: number; y: number; z: number } {
  // Convert RGB to sRGB
  r = r / 255;
  g = g / 255;
  b = b / 255;

  // Apply gamma correction
  r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

  // Convert to XYZ
  return {
    x: (r * 0.4124 + g * 0.3576 + b * 0.1805) * 100,
    y: (r * 0.2126 + g * 0.7152 + b * 0.0722) * 100,
    z: (r * 0.0193 + g * 0.1192 + b * 0.9505) * 100
  };
}

// Convert XYZ to LAB color space
function xyzToLab(x: number, y: number, z: number): { l: number; a: number; b: number } {
  // D65 illuminant
  const xn = 95.047;
  const yn = 100.000;
  const zn = 108.883;

  // Convert to LAB
  x = x / xn;
  y = y / yn;
  z = z / zn;

  x = x > 0.008856 ? Math.pow(x, 1/3) : (7.787 * x) + 16/116;
  y = y > 0.008856 ? Math.pow(y, 1/3) : (7.787 * y) + 16/116;
  z = z > 0.008856 ? Math.pow(z, 1/3) : (7.787 * z) + 16/116;

  return {
    l: (116 * y) - 16,
    a: 500 * (x - y),
    b: 200 * (y - z)
  };
}

// Convert RGB to LAB
function rgbToLab(r: number, g: number, b: number): { l: number; a: number; b: number } {
  const xyz = rgbToXyz(r, g, b);
  return xyzToLab(xyz.x, xyz.y, xyz.z);
}

// Calculate Delta E (color difference) in LAB space
function deltaE(lab1: { l: number; a: number; b: number }, lab2: { l: number; a: number; b: number }): number {
  return Math.sqrt(
    Math.pow(lab2.l - lab1.l, 2) +
    Math.pow(lab2.a - lab1.a, 2) +
    Math.pow(lab2.b - lab1.b, 2)
  );
}

// Enhanced color distance function using RGB, HSL, and LAB spaces
export function colorDistance(hex1: string, hex2: string): number {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  
  // RGB distance
  const rgbDistance = Math.sqrt(
    Math.pow(rgb2.r - rgb1.r, 2) +
    Math.pow(rgb2.g - rgb1.g, 2) +
    Math.pow(rgb2.b - rgb1.b, 2)
  );

  // HSL distance
  const hsl1 = rgbToHsl(rgb1.r, rgb1.g, rgb1.b);
  const hsl2 = rgbToHsl(rgb2.r, rgb2.g, rgb2.b);
  const hslDistance = Math.sqrt(
    Math.pow((hsl2.h - hsl1.h) / 360, 2) +
    Math.pow((hsl2.s - hsl1.s) / 100, 2) +
    Math.pow((hsl2.l - hsl1.l) / 100, 2)
  );

  // LAB distance (Delta E)
  const lab1 = rgbToLab(rgb1.r, rgb1.g, rgb1.b);
  const lab2 = rgbToLab(rgb2.r, rgb2.g, rgb2.b);
  const labDistance = deltaE(lab1, lab2);

  // Weighted combination of all color spaces
  // LAB is most perceptually accurate, so we weight it more heavily
  return (rgbDistance * 0.2) + (hslDistance * 0.3) + (labDistance * 0.5);
}

// Mix colors by weighted average using percentages of each color
export function mixColors(colors: Array<{ hex: string; percentage: number }>): string {
  let r = 0, g = 0, b = 0;
  let totalPercentage = 0;

  colors.forEach(color => {
    const rgb = hexToRgb(color.hex);
    const p = color.percentage / 100;
    r += rgb.r * p;
    g += rgb.g * p;
    b += rgb.b * p;
    totalPercentage += p;
  });

  if (totalPercentage !== 1) {
    r /= totalPercentage;
    g /= totalPercentage;
    b /= totalPercentage;
  }

  return rgbToHex(r, g, b);
}

// Enhanced validation rules for paint mixing
function validateMix(mix: Array<{ name: string; percentage: number; hex: string }>): boolean {
  // Basic validation
  const hasImpracticalPercentage = mix.some(color => color.percentage < 1);
  const hasTooManyColors = mix.length > 3;
  const hasBothWhiteAndBlack = mix.some(c => c.name === "White") && 
                              mix.some(c => c.name === "Black");

  // Advanced validation rules
  const primaryColors = mix.filter(c => 
    c.name === "Cyan" || 
    c.name === "Magenta" || 
    c.name === "Yellow"
  );

  // Rule 1: At least one primary color should be present
  const hasPrimaryColor = primaryColors.length > 0;

  // Rule 2: If using two primary colors, they should be adjacent on the color wheel
  const hasValidPrimaryCombination = primaryColors.length <= 2 || 
    (primaryColors.length === 2 && (
      (primaryColors.some(c => c.name === "Cyan") && 
       primaryColors.some(c => c.name === "Magenta")) ||
      (primaryColors.some(c => c.name === "Magenta") && 
       primaryColors.some(c => c.name === "Yellow")) ||
      (primaryColors.some(c => c.name === "Yellow") && 
       primaryColors.some(c => c.name === "Cyan"))
    ));

  // Rule 3: If using white, it should be less than 50% of the mix
  const whitePercentage = mix.find(c => c.name === "White")?.percentage || 0;
  const hasValidWhitePercentage = whitePercentage < 50;

  // Rule 4: If using black, it should be less than 20% of the mix
  const blackPercentage = mix.find(c => c.name === "Black")?.percentage || 0;
  const hasValidBlackPercentage = blackPercentage < 20;

  // Rule 5: The sum of white and black should be less than 60%
  const hasValidNeutralMix = (whitePercentage + blackPercentage) < 60;

  return !hasImpracticalPercentage && 
         !hasTooManyColors && 
         !hasBothWhiteAndBlack &&
         hasPrimaryColor &&
         hasValidPrimaryCombination &&
         hasValidWhitePercentage &&
         hasValidBlackPercentage &&
         hasValidNeutralMix;
}

// Find the best mix from the standard base palette
export function findBestColorMix(targetHex: string): {
  colorMix: Array<{ name: string; percentage: number; hex: string }>;
  mixedColor: string;
} {
  const targetRgb = hexToRgb(targetHex);
  let bestMix = {
    colorMix: [] as Array<{ name: string; percentage: number; hex: string }>,
    mixedColor: "",
    distance: Infinity
  };

  // Function to try a specific combination of colors
  const tryCombination = (c: number, m: number, y: number, w: number, k: number) => {
    const mixArray: Array<{ hex: string; percentage: number }> = [];
    if (c > 0) mixArray.push({ hex: paintColors[0].hex, percentage: c });
    if (m > 0) mixArray.push({ hex: paintColors[1].hex, percentage: m });
    if (y > 0) mixArray.push({ hex: paintColors[2].hex, percentage: y });
    if (w > 0) mixArray.push({ hex: paintColors[3].hex, percentage: w });
    if (k > 0) mixArray.push({ hex: paintColors[4].hex, percentage: k });

    const mixedHex = mixColors(mixArray);
    const distance = colorDistance(targetHex, mixedHex);

    if (distance < bestMix.distance) {
      const colorMix = mixArray.map(c => ({
        name: paintColors.find(pc => pc.hex === c.hex)!.name,
        percentage: c.percentage,
        hex: c.hex,
      }));

      // Only update if the mix is practical
      if (validateMix(colorMix)) {
        bestMix = {
          colorMix,
          mixedColor: mixedHex,
          distance,
        };
      }
    }
  };

  // First pass: Try with 5% increments
  const step1 = 5;
  for (let c = 0; c <= 100; c += step1) {
    for (let m = 0; m <= 100 - c; m += step1) {
      for (let y = 0; y <= 100 - c - m; y += step1) {
        const remaining = 100 - c - m - y;
        for (let w = 0; w <= remaining; w += step1) {
          const k = remaining - w;
          tryCombination(c, m, y, w, k);
        }
      }
    }
  }

  // Second pass: If we didn't find a good match, try with 2% increments around the best match
  if (bestMix.distance > 15) {
    const step2 = 2;
    const currentMix = bestMix.colorMix;
    const baseC = currentMix.find(c => c.name === "Cyan")?.percentage || 0;
    const baseM = currentMix.find(c => c.name === "Magenta")?.percentage || 0;
    const baseY = currentMix.find(c => c.name === "Yellow")?.percentage || 0;
    const baseW = currentMix.find(c => c.name === "White")?.percentage || 0;
    const baseK = currentMix.find(c => c.name === "Black")?.percentage || 0;

    for (let c = Math.max(0, baseC - 10); c <= Math.min(100, baseC + 10); c += step2) {
      for (let m = Math.max(0, baseM - 10); m <= Math.min(100 - c, baseM + 10); m += step2) {
        for (let y = Math.max(0, baseY - 10); y <= Math.min(100 - c - m, baseY + 10); y += step2) {
          const remaining = 100 - c - m - y;
          for (let w = Math.max(0, baseW - 10); w <= Math.min(remaining, baseW + 10); w += step2) {
            const k = remaining - w;
            tryCombination(c, m, y, w, k);
          }
        }
      }
    }
  }

  // Final pass: Try with 1% increments for fine-tuning
  if (bestMix.distance > 10) {
    const step3 = 1;
    const currentMix = bestMix.colorMix;
    const baseC = currentMix.find(c => c.name === "Cyan")?.percentage || 0;
    const baseM = currentMix.find(c => c.name === "Magenta")?.percentage || 0;
    const baseY = currentMix.find(c => c.name === "Yellow")?.percentage || 0;
    const baseW = currentMix.find(c => c.name === "White")?.percentage || 0;
    const baseK = currentMix.find(c => c.name === "Black")?.percentage || 0;

    for (let c = Math.max(0, baseC - 5); c <= Math.min(100, baseC + 5); c += step3) {
      for (let m = Math.max(0, baseM - 5); m <= Math.min(100 - c, baseM + 5); m += step3) {
        for (let y = Math.max(0, baseY - 5); y <= Math.min(100 - c - m, baseY + 5); y += step3) {
          const remaining = 100 - c - m - y;
          for (let w = Math.max(0, baseW - 5); w <= Math.min(remaining, baseW + 5); w += step3) {
            const k = remaining - w;
            tryCombination(c, m, y, w, k);
          }
        }
      }
    }
  }

  // Round percentages to whole numbers for cleaner display
  bestMix.colorMix = bestMix.colorMix.map(color => ({
    ...color,
    percentage: Math.round(color.percentage)
  }));

  return {
    colorMix: bestMix.colorMix,
    mixedColor: bestMix.mixedColor,
  };
}
