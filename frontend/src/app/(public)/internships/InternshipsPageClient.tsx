'use client';

import Image from 'next/image';
import { Grid, Card, CardContent, Typography, Stack, Chip, Box } from '@mui/material';
import Section from '@/components/shared/Section';
import PageHeader from '@/components/shared/PageHeader';
import EmptyState from '@/components/shared/EmptyState';
import Reveal from '@/components/shared/Reveal';
import { useInternships } from '@/hooks/usePublicData';
import { resolveUploadUrl } from '@/lib/axios';

export default function InternshipsPageClient() {
  const { data: internships, isLoading } = useInternships();
  const list = internships || [];

  return (
    <>
      <PageHeader
        eyebrow="> ls ./internships"
        title="Internships"
        description="Hands-on experience gained through internship programs."
      />
      <Section>
        {isLoading ? null : list.length === 0 ? (
          <EmptyState title="No internships added yet" description="Internship history will appear here once added." />
        ) : (
          <Grid container spacing={3}>
            {list.map((internship, i) => (
              <Grid item xs={12} md={6} key={internship.id}>
                <Reveal delay={i * 0.06}>
                  <Card variant="outlined" sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, height: '100%' }}>
                    {internship.certificateImage && (
                      <Box sx={{ position: 'relative', width: { xs: '100%', sm: 160 }, aspectRatio: { xs: '16/9', sm: 'auto' }, flexShrink: 0 }}>
                        <Image
                          src={resolveUploadUrl(internship.certificateImage)}
                          alt={`${internship.company} certificate`}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      </Box>
                    )}
                    <CardContent sx={{ flex: 1 }}>
                      <Typography className="mono" variant="caption" color="primary.main">
                        {internship.duration}
                      </Typography>
                      <Typography variant="h6" sx={{ mt: 0.5 }}>
                        {internship.role}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                        {internship.company}
                      </Typography>
                      {internship.description && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                          {internship.description}
                        </Typography>
                      )}
                      {internship.skillsUsed.length > 0 && (
                        <Stack direction="row" spacing={0.75} sx={{ flexWrap: 'wrap', gap: 0.75 }}>
                          {internship.skillsUsed.map((s) => (
                            <Chip key={s} label={s} size="small" variant="outlined" />
                          ))}
                        </Stack>
                      )}
                    </CardContent>
                  </Card>
                </Reveal>
              </Grid>
            ))}
          </Grid>
        )}
      </Section>
    </>
  );
}
