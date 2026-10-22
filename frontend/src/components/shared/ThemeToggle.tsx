'use client';

import { IconButton, Tooltip } from '@mui/material';
import { LuSun, LuMoon } from 'react-icons/lu';
import { useColorMode } from '@/theme/ColorModeContext';

export default function ThemeToggle() {
  const { mode, toggleMode } = useColorMode();

  return (
    <Tooltip title={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
      <IconButton
        onClick={toggleMode}
        aria-label="Toggle color mode"
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: '999px',
          width: 40,
          height: 40,
        }}
      >
        {mode === 'dark' ? <LuSun size={18} /> : <LuMoon size={18} />}
      </IconButton>
    </Tooltip>
  );
}
