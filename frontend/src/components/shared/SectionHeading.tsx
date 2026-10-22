import { Box, Typography } from '@mui/material';

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
}

export default function SectionHeading({ eyebrow, title, description, align = 'left' }: SectionHeadingProps) {
  return (
    <Box sx={{ mb: { xs: 4, md: 6 }, textAlign: align, maxWidth: align === 'center' ? 640 : 720, mx: align === 'center' ? 'auto' : 0 }}>
      <Typography
        className="mono"
        variant="overline"
        sx={{
          color: 'primary.main',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 1,
          mb: 1.5,
          '&::before': {
            content: '""',
            width: 18,
            height: 1,
            bgcolor: 'primary.main',
            display: { xs: 'none', sm: 'inline-block' },
          },
        }}
      >
        {eyebrow}
      </Typography>
      <Typography variant="h3" sx={{ fontSize: { xs: '1.75rem', md: '2.25rem' } }}>
        {title}
      </Typography>
      {description && (
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1.5 }}>
          {description}
        </Typography>
      )}
    </Box>
  );
}
