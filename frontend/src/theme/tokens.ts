// ── Design tokens ────────────────────────────────────────────
// Identity: a data professional's portfolio. Deep navy instead of
// pure black, a teal "signal" accent (data/clarity) and a warm amber
// "insight" accent (the human takeaway from the data). Fraunces gives
// headlines editorial warmth; Inter keeps body copy quiet; JetBrains
// Mono is used sparingly for labels, metrics, and code-flavored UI —
// literal vocabulary for this subject, not decoration.

export const fonts = {
  display: "var(--font-fraunces), Georgia, serif",
  body: "var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif",
  mono: "var(--font-jetbrains-mono), 'Fira Code', monospace",
};

export const darkPalette = {
  bg: '#0B1120',
  bgElevated: '#111A2E',
  surface: '#141F38',
  surfaceHover: '#1B2B4A',
  border: 'rgba(148, 163, 184, 0.14)',
  ink: '#E7ECF5',
  inkMuted: '#94A3B8',
  accent: '#2DD4BF', // signal — teal
  accentSoft: 'rgba(45, 212, 191, 0.12)',
  secondary: '#F5A524', // insight — amber
  secondarySoft: 'rgba(245, 165, 36, 0.12)',
  danger: '#F87171',
  success: '#4ADE80',
};

export const lightPalette = {
  bg: '#F6F8FB',
  bgElevated: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceHover: '#EEF2F8',
  border: 'rgba(15, 23, 42, 0.10)',
  ink: '#101828',
  inkMuted: '#5B6577',
  accent: '#0F9C8D', // slightly deepened teal for AA contrast on white
  accentSoft: 'rgba(15, 156, 141, 0.10)',
  secondary: '#C97A11',
  secondarySoft: 'rgba(201, 122, 17, 0.10)',
  danger: '#DC2626',
  success: '#16A34A',
};

export const radii = {
  sm: 8,
  md: 14,
  lg: 22,
  pill: 999,
};
