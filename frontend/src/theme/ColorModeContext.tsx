'use client';

import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createAppTheme } from './createAppTheme';

type Mode = 'light' | 'dark';

interface ColorModeContextValue {
  mode: Mode;
  toggleMode: () => void;
}

const ColorModeContext = createContext<ColorModeContextValue>({
  mode: 'dark',
  toggleMode: () => {},
});

export const useColorMode = () => useContext(ColorModeContext);

const STORAGE_KEY = 'portfolio-cms-theme-mode';

export function ColorModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Mode | null;
    if (stored === 'light' || stored === 'dark') {
      setMode(stored);
    } else if (window.matchMedia?.('(prefers-color-scheme: light)').matches) {
      setMode('light');
    }
    setMounted(true);
  }, []);

  const toggleMode = () => {
    setMode((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      window.localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  };

  const theme = useMemo(() => createAppTheme(mode), [mode]);

  return (
    <ColorModeContext.Provider value={{ mode, toggleMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div style={{ visibility: mounted ? 'visible' : 'hidden' }}>{children}</div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
