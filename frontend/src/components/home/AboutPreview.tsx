'use client';

import Link from 'next/link';
import { Grid, Stack, Typography, Button, Box } from '@mui/material';
import { LuArrowRight, LuMapPin, LuLanguages } from 'react-icons/lu';
import Section from '@/components/shared/Section';
import SectionHeading from '@/components/shared/SectionHeading';
import Reveal from '@/components/shared/Reveal';
import { useAbout } from '@/hooks/usePublicData';

export default function AboutPreview() {
  const { data: about } = useAbout();

  if (!about) return null;

  return (
    <Section bordered>
      <Grid container spacing={6}>
        <Grid item xs={12} md={5}>
          <Reveal>
            <SectionHeading eyebrow="01 · About" title="A little about my work" />
          </Reveal>
        </Grid>
        <Grid item xs={12} md={7}>
          <Reveal delay={0.1}>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.05rem', lineHeight: 1.8 }}>
              {about.biography}
            </Typography>

            <Stack direction="row" spacing={3} sx={{ mt: 3, flexWrap: 'wrap', gap: 2 }}>
              {about.location && (
                <Stack direction="row" spacing={1} alignItems="center">
                  <LuMapPin size={16} />
                  <Typography variant="body2" color="text.secondary">
                    {about.location}
                  </Typography>
                </Stack>
              )}
              {about.languages?.length > 0 && (
                <Stack direction="row" spacing={1} alignItems="center">
                  <LuLanguages size={16} />
                  <Typography variant="body2" color="text.secondary">
                    {about.languages.join(', ')}
                  </Typography>
                </Stack>
              )}
            </Stack>

            <Box sx={{ mt: 4 }}>
              <Button component={Link} href="/about" endIcon={<LuArrowRight size={16} />}>
                More about me
              </Button>
            </Box>
          </Reveal>
        </Grid>
      </Grid>
    </Section>
  );
}
