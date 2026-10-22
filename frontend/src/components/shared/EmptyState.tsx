import { Box, Typography } from '@mui/material';
import { LuInbox } from 'react-icons/lu';

export default function EmptyState({
  title = 'Nothing here yet',
  description = 'Check back soon.',
}: {
  title?: string;
  description?: string;
}) {
  return (
    <Box
      sx={{
        textAlign: 'center',
        py: 8,
        px: 3,
        border: '1px dashed',
        borderColor: 'divider',
        borderRadius: 3,
      }}
    >
      <LuInbox size={28} style={{ opacity: 0.5 }} />
      <Typography variant="h6" sx={{ mt: 2 }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        {description}
      </Typography>
    </Box>
  );
}
