import type { Metadata } from 'next';
import { Grid, Card, CardContent, Typography, Box, Stack } from '@mui/material';
import * as LuIcons from 'react-icons/lu';
import Section from '@/components/shared/Section';
import PageHeader from '@/components/shared/PageHeader';
import { achievements } from '@/config/achievements';

export const metadata: Metadata = {
  title: 'Achievements',
  description: 'Notable wins, recognitions, and milestones.',
};

export default function AchievementsPage() {
  return (
    <>
      <PageHeader eyebrow="> ./achievements --sorted" title="Achievements" description="A few milestones I'm proud of." />
      <Section>
        <Grid container spacing={3}>
          {achievements.map((item) => {
            const Icon = (LuIcons as unknown as Record<string, React.ComponentType<{ size?: number }>>)[item.icon] || LuIcons.LuAward;
            return (
              <Grid item xs={12} sm={6} key={item.title}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent sx={{ p: 3.5, display: 'flex', gap: 2 }}>
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        flexShrink: 0,
                        borderRadius: '50%',
                        display: 'grid',
                        placeItems: 'center',
                        bgcolor: 'secondary.main',
                        color: '#20140A',
                      }}
                    >
                      <Icon size={20} />
                    </Box>
                    <Box>
                      <Stack direction="row" spacing={1} alignItems="baseline">
                        <Typography variant="subtitle1" fontWeight={700}>
                          {item.title}
                        </Typography>
                        <Typography variant="caption" className="mono" color="text.secondary">
                          {item.year}
                        </Typography>
                      </Stack>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {item.description}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Section>
    </>
  );
}
