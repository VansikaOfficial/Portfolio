import { Box, Typography } from '@mui/material';
import Link from 'next/link';

export default function Logo({ name = 'Portfolio' }: { name?: string }) {
  const initial = name?.trim()?.[0]?.toUpperCase() || 'P';

  return (
    <Box
      component={Link}
      href="/"
      sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.1, textDecoration: 'none' }}
    >
      <Box
        sx={{
          width: 34,
          height: 34,
          borderRadius: '10px',
          display: 'grid',
          placeItems: 'center',
          background: (theme) =>
            `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          color: '#04201C',
          fontFamily: 'var(--font-jetbrains-mono)',
          fontWeight: 700,
          fontSize: '0.95rem',
        }}
      >
        {initial}
      </Box>
      <Typography
        sx={{
          fontFamily: 'var(--font-fraunces)',
          fontWeight: 600,
          fontSize: '1.15rem',
          color: 'text.primary',
          letterSpacing: '-0.01em',
        }}
      >
        {name}
      </Typography>
    </Box>
  );
}
