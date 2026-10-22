import { Container, Box, SxProps, Theme } from '@mui/material';

interface SectionProps {
  children: React.ReactNode;
  sx?: SxProps<Theme>;
  id?: string;
  bordered?: boolean;
}

export default function Section({ children, sx, id, bordered }: SectionProps) {
  return (
    <Box
      id={id}
      component="section"
      sx={{
        py: { xs: 7, md: 11 },
        borderTop: bordered ? '1px solid' : 'none',
        borderColor: 'divider',
        ...sx,
      }}
    >
      <Container maxWidth="lg">{children}</Container>
    </Box>
  );
}
