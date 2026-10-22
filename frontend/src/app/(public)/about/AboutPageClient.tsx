'use client';

import { Grid, Stack, Typography, Chip, Avatar, Skeleton, Box, Divider } from '@mui/material';
import { LuMapPin, LuMail, LuPhone, LuLanguages, LuHeart, LuCircleDot } from 'react-icons/lu';
import Section from '@/components/shared/Section';
import PageHeader from '@/components/shared/PageHeader';
import Reveal from '@/components/shared/Reveal';
import { useAbout } from '@/hooks/usePublicData';
import { resolveUploadUrl } from '@/lib/axios';

export default function AboutPageClient() {
  const { data: about, isLoading } = useAbout();

  return (
    <>
      <PageHeader
        eyebrow="> cat about.md"
        title="About me"
        description="The story behind the numbers — background, philosophy, and what drives my work."
      />

      <Section>
        {isLoading || !about ? (
          <Grid container spacing={6}>
            <Grid item xs={12} md={4}>
              <Skeleton variant="circular" width={160} height={160} />
            </Grid>
            <Grid item xs={12} md={8}>
              <Skeleton variant="text" height={40} width="60%" />
              <Skeleton variant="text" height={100} />
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={{ xs: 5, md: 8 }}>
            <Grid item xs={12} md={4}>
              <Reveal>
                <Stack spacing={3} alignItems={{ xs: 'center', md: 'flex-start' }}>
                  {about.profilePhoto && (
                    <Avatar
                      src={resolveUploadUrl(about.profilePhoto)}
                      alt={about.fullName}
                      sx={{ width: 180, height: 180, border: '3px solid', borderColor: 'primary.main' }}
                    />
                  )}
                  <Chip
                    icon={<LuCircleDot size={13} />}
                    label={about.currentStatus}
                    sx={{ bgcolor: 'transparent', border: '1px solid', borderColor: 'primary.main', color: 'primary.main' }}
                  />
                  <Stack spacing={1.5} sx={{ width: '100%' }}>
                    {about.location && (
                      <Stack direction="row" spacing={1.25} alignItems="center">
                        <LuMapPin size={16} />
                        <Typography variant="body2">{about.location}</Typography>
                      </Stack>
                    )}
                    {about.email && (
                      <Stack direction="row" spacing={1.25} alignItems="center">
                        <LuMail size={16} />
                        <Typography variant="body2" component="a" href={`mailto:${about.email}`}>
                          {about.email}
                        </Typography>
                      </Stack>
                    )}
                    {about.phone && (
                      <Stack direction="row" spacing={1.25} alignItems="center">
                        <LuPhone size={16} />
                        <Typography variant="body2">{about.phone}</Typography>
                      </Stack>
                    )}
                    {about.languages?.length > 0 && (
                      <Stack direction="row" spacing={1.25} alignItems="flex-start">
                        <LuLanguages size={16} style={{ marginTop: 3 }} />
                        <Typography variant="body2">{about.languages.join(', ')}</Typography>
                      </Stack>
                    )}
                    {about.interests?.length > 0 && (
                      <Stack direction="row" spacing={1.25} alignItems="flex-start">
                        <LuHeart size={16} style={{ marginTop: 3 }} />
                        <Typography variant="body2">{about.interests.join(', ')}</Typography>
                      </Stack>
                    )}
                  </Stack>
                </Stack>
              </Reveal>
            </Grid>

            <Grid item xs={12} md={8}>
              <Reveal delay={0.1}>
                <Typography variant="h5" sx={{ mb: 2 }}>
                  Biography
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.9, whiteSpace: 'pre-line' }}>
                  {about.biography}
                </Typography>

                <Divider sx={{ my: 4 }} />

                <Typography variant="h5" sx={{ mb: 2 }}>
                  Career objective
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.9, whiteSpace: 'pre-line' }}>
                  {about.careerObjective}
                </Typography>
              </Reveal>
            </Grid>
          </Grid>
        )}
      </Section>
    </>
  );
}
