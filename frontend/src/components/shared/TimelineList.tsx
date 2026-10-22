import { Box, Typography, Stack, Chip } from '@mui/material';
import Reveal from '@/components/shared/Reveal';

export interface TimelineEntry {
  id: string;
  title: string;
  subtitle: string;
  period: string;
  location?: string | null;
  badge?: string;
  bullets?: string[];
  tags?: string[];
}

export default function TimelineList({ entries }: { entries: TimelineEntry[] }) {
  return (
    <Box sx={{ position: 'relative' }}>
      <Box
        sx={{
          position: 'absolute',
          left: { xs: 7, sm: 9 },
          top: 8,
          bottom: 8,
          width: '2px',
          bgcolor: 'divider',
        }}
      />
      <Stack spacing={5}>
        {entries.map((entry, i) => (
          <Reveal key={entry.id} delay={i * 0.06}>
            <Box sx={{ position: 'relative', pl: { xs: 4, sm: 5 } }}>
              <Box
                sx={{
                  position: 'absolute',
                  left: 0,
                  top: 6,
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  bgcolor: 'background.default',
                  border: '3px solid',
                  borderColor: 'primary.main',
                }}
              />
              <Typography className="mono" variant="caption" color="primary.main">
                {entry.period}
              </Typography>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 0.5, flexWrap: 'wrap' }}>
                <Typography variant="h6">{entry.title}</Typography>
                {entry.badge && <Chip label={entry.badge} size="small" color="secondary" />}
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                {entry.subtitle}
                {entry.location ? ` · ${entry.location}` : ''}
              </Typography>

              {entry.bullets && entry.bullets.length > 0 && (
                <Stack component="ul" spacing={0.75} sx={{ mt: 1.5, pl: 2.5 }}>
                  {entry.bullets.map((b, idx) => (
                    <Typography component="li" variant="body2" color="text.secondary" key={idx}>
                      {b}
                    </Typography>
                  ))}
                </Stack>
              )}

              {entry.tags && entry.tags.length > 0 && (
                <Stack direction="row" spacing={0.75} sx={{ mt: 1.5, flexWrap: 'wrap', gap: 0.75 }}>
                  {entry.tags.map((tag) => (
                    <Chip key={tag} label={tag} size="small" variant="outlined" />
                  ))}
                </Stack>
              )}
            </Box>
          </Reveal>
        ))}
      </Stack>
    </Box>
  );
}
