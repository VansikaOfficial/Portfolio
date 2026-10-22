import type { Metadata } from 'next';
import { Grid, Card, CardContent, Typography, Stack, Box } from '@mui/material';
import * as LuIcons from 'react-icons/lu';
import Section from '@/components/shared/Section';
import PageHeader from '@/components/shared/PageHeader';
import { services } from '@/config/services';

export const metadata: Metadata = {
  title: 'Services',
  description: 'Ways I can help with data analysis, machine learning, and AI product work.',
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="> ./services --list"
        title="How I can help"
        description="Focused engagements across the data-to-decision lifecycle."
      />
      <Section>
        <Grid container spacing={3}>
          {services.map((service) => {
            const Icon = (LuIcons as unknown as Record<string, React.ComponentType<{ size?: number }>>)[service.icon] || LuIcons.LuSparkles;
            return (
              <Grid item xs={12} sm={6} key={service.title}>
                <Card variant="outlined" sx={{ height: '100%', '&:hover': { borderColor: 'primary.main' } }}>
                  <CardContent sx={{ p: 3.5 }}>
                    <Box
                      sx={{
                        width: 46,
                        height: 46,
                        borderRadius: 2.5,
                        display: 'grid',
                        placeItems: 'center',
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText',
                        mb: 2,
                      }}
                    >
                      <Icon size={22} />
                    </Box>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      {service.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {service.description}
                    </Typography>
                    <Stack spacing={0.75}>
                      {service.deliverables.map((d) => (
                        <Typography key={d} variant="caption" className="mono" color="text.secondary">
                          → {d}
                        </Typography>
                      ))}
                    </Stack>
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
