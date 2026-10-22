import Link from 'next/link';
import { Box, Typography, Button, Stack } from '@mui/material';
import { LuArrowLeft, LuGhost } from 'react-icons/lu';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function NotFound() {
  return (
    <Box sx={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <Box component="main" sx={{ flex: 1, display: 'grid', placeItems: 'center', py: 12, px: 3 }}>
        <Stack alignItems="center" spacing={2} textAlign="center">
          <LuGhost size={40} style={{ opacity: 0.5 }} />
          <Typography className="mono" variant="overline" color="primary.main">
            404 · not found
          </Typography>
          <Typography variant="h2" sx={{ fontSize: { xs: '2.2rem', md: '3rem' } }}>
            This page went missing
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 420 }}>
            The page you&apos;re looking for doesn&apos;t exist, or may have been moved.
          </Typography>
          <Button component={Link} href="/" variant="contained" startIcon={<LuArrowLeft size={16} />} sx={{ mt: 2 }}>
            Back to home
          </Button>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
}
