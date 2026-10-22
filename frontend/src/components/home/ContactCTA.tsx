'use client';

import Link from 'next/link';
import { Box, Typography, Button, Stack } from '@mui/material';
import { LuArrowUpRight, LuMail } from 'react-icons/lu';
import Section from '@/components/shared/Section';
import Reveal from '@/components/shared/Reveal';
import { useAbout } from '@/hooks/usePublicData';

export default function ContactCTA() {
  const { data: about } = useAbout();

  return (
    <Section>
      <Reveal>
        <Box
          sx={{
            textAlign: 'center',
            py: { xs: 6, md: 9 },
            px: { xs: 3, md: 8 },
            borderRadius: 6,
            border: '1px solid',
            borderColor: 'divider',
            background: (theme) =>
              theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, rgba(45,212,191,0.08), rgba(245,165,36,0.05))'
                : 'linear-gradient(135deg, rgba(15,156,141,0.06), rgba(201,122,17,0.04))',
          }}
        >
          <Typography className="mono" variant="overline" color="primary.main">
            05 · Let&apos;s talk
          </Typography>
          <Typography variant="h3" sx={{ mt: 1.5, mb: 2, fontSize: { xs: '1.75rem', md: '2.5rem' } }}>
            {about?.availableForWork ? "Got a project in mind? Let's build it." : "Let's stay in touch."}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 480, mx: 'auto', mb: 4 }}>
            Whether it&apos;s a data problem, a model to ship, or a dashboard to design — I&apos;d love to hear about it.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button component={Link} href="/contact" variant="contained" size="large" endIcon={<LuArrowUpRight size={18} />}>
              Start a conversation
            </Button>
            {about?.email && (
              <Button
                component="a"
                href={`mailto:${about.email}`}
                variant="outlined"
                size="large"
                startIcon={<LuMail size={18} />}
              >
                {about.email}
              </Button>
            )}
          </Stack>
        </Box>
      </Reveal>
    </Section>
  );
}
