import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Box } from '@mui/material';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <Box component="main" sx={{ flex: 1 }}>
        {children}
      </Box>
      <Footer />
    </Box>
  );
}
