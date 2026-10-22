'use client';

import { Box, CircularProgress } from '@mui/material';

export default function Loading() {
  return (
    <Box sx={{ minHeight: '60dvh', display: 'grid', placeItems: 'center' }}>
      <CircularProgress size={28} thickness={4} sx={{ color: 'primary.main' }} />
    </Box>
  );
}
