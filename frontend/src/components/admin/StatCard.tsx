import { Card, CardContent, Stack, Typography, Box } from '@mui/material';
import type { IconType } from 'react-icons';

export default function StatCard({
  label,
  value,
  icon: Icon,
  accent = 'primary.main',
}: {
  label: string;
  value: number | string;
  icon: IconType;
  accent?: string;
}) {
  return (
    <Card variant="outlined">
      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: 2.5,
            display: 'grid',
            placeItems: 'center',
            bgcolor: 'action.hover',
            color: accent,
            flexShrink: 0,
          }}
        >
          <Icon size={20} />
        </Box>
        <Stack>
          <Typography variant="h5" sx={{ fontFamily: 'var(--font-fraunces)', lineHeight: 1.1 }}>
            {value}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {label}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
