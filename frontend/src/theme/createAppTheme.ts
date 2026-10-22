import { createTheme, ThemeOptions } from '@mui/material/styles';
import { fonts, darkPalette, lightPalette, radii } from './tokens';

export const createAppTheme = (mode: 'light' | 'dark') => {
  const p = mode === 'dark' ? darkPalette : lightPalette;

  const options: ThemeOptions = {
    palette: {
      mode,
      background: { default: p.bg, paper: p.surface },
      text: { primary: p.ink, secondary: p.inkMuted },
      primary: { main: p.accent, contrastText: mode === 'dark' ? '#04201C' : '#FFFFFF' },
      secondary: { main: p.secondary, contrastText: '#20140A' },
      error: { main: p.danger },
      success: { main: p.success },
      divider: p.border,
    },
    shape: { borderRadius: radii.md },
    typography: {
      fontFamily: fonts.body,
      h1: { fontFamily: fonts.display, fontWeight: 600, letterSpacing: '-0.02em' },
      h2: { fontFamily: fonts.display, fontWeight: 600, letterSpacing: '-0.015em' },
      h3: { fontFamily: fonts.display, fontWeight: 600, letterSpacing: '-0.01em' },
      h4: { fontFamily: fonts.display, fontWeight: 600 },
      h5: { fontFamily: fonts.display, fontWeight: 600 },
      h6: { fontFamily: fonts.display, fontWeight: 600 },
      button: { textTransform: 'none', fontWeight: 600 },
      overline: { fontFamily: fonts.mono, letterSpacing: '0.14em', fontWeight: 500 },
      caption: { fontFamily: fonts.mono },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: p.bg,
            backgroundImage:
              mode === 'dark'
                ? 'radial-gradient(60% 50% at 15% 0%, rgba(45,212,191,0.07) 0%, rgba(45,212,191,0) 60%), radial-gradient(50% 40% at 100% 10%, rgba(245,165,36,0.06) 0%, rgba(245,165,36,0) 60%)'
                : 'radial-gradient(60% 50% at 15% 0%, rgba(15,156,141,0.06) 0%, rgba(15,156,141,0) 60%)',
            backgroundAttachment: 'fixed',
          },
          '::selection': {
            background: p.accent,
            color: mode === 'dark' ? '#04201C' : '#FFFFFF',
          },
          ':focus-visible': {
            outline: `2px solid ${p.accent}`,
            outlineOffset: '2px',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            border: `1px solid ${p.border}`,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: { borderRadius: radii.pill, paddingInline: 22, paddingBlock: 10 },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { borderRadius: radii.sm, fontFamily: fonts.mono, fontSize: '0.72rem' },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: radii.lg,
            transition: 'transform 220ms ease, border-color 220ms ease, box-shadow 220ms ease',
          },
        },
      },
    },
  };

  return createTheme(options);
};
