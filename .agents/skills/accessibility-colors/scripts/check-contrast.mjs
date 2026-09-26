/**
 * WCAG 2.1 Color Contrast Ratio Validator
 * Usage: node check-contrast.mjs <foreground_hex> <background_hex>
 * Example: node check-contrast.mjs "#0f172a" "#f8fafc"
 */

function parseHex(hex) {
  let clean = hex.replace("#", "").trim();
  if (clean.length === 3) {
    clean = clean
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const num = parseInt(clean, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function getLuminance({ r, g, b }) {
  const [rs, gs, bs] = [r, g, b].map((val) => {
    const s = val / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

export function calculateContrastRatio(fgHex, bgHex) {
  const lum1 = getLuminance(parseHex(fgHex));
  const lum2 = getLuminance(parseHex(bgHex));
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

export function evaluateWcag(ratio) {
  return {
    ratio: Number(ratio.toFixed(2)),
    normalTextAA: ratio >= 4.5,
    normalTextAAA: ratio >= 7.0,
    largeTextAA: ratio >= 3.0,
    largeTextAAA: ratio >= 4.5,
    uiComponentsAA: ratio >= 3.0,
  };
}

const args = process.argv.slice(2);
if (args.length >= 2) {
  const [fg, bg] = args;
  const ratio = calculateContrastRatio(fg, bg);
  const result = evaluateWcag(ratio);
  console.log(`\n🎨 WCAG 2.1 Contrast Check:`);
  console.log(`  Foreground: ${fg}`);
  console.log(`  Background: ${bg}`);
  console.log(`  Contrast Ratio: ${result.ratio}:1`);
  console.log(`  Normal Text (AA >= 4.5:1):   ${result.normalTextAA ? "✅ PASS" : "❌ FAIL"}`);
  console.log(`  Normal Text (AAA >= 7.0:1):  ${result.normalTextAAA ? "✅ PASS" : "❌ FAIL"}`);
  console.log(`  Large Text / UI (AA >= 3:1): ${result.largeTextAA ? "✅ PASS" : "❌ FAIL"}`);
}
