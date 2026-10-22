import { Box, Container, Typography } from '@mui/material';

export default function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <Box
      sx={{
        pt: { xs: 6, md: 9 },
        pb: { xs: 4, md: 5 },
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Typography
          className="mono"
          variant="overline"
          color="primary.main"
          sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}
        >
          {eyebrow}
        </Typography>
        <Typography variant="h2" sx={{ mt: 1, fontSize: { xs: '2rem', md: '2.75rem' } }}>
          {title}
        </Typography>
        {description && (
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1.5, maxWidth: 640 }}>
            {description}
          </Typography>
        )}
      </Container>
    </Box>
  );
}
