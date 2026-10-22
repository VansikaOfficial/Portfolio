'use client';

import Link from 'next/link';
import { Box, Container, Grid, Stack, Typography, IconButton } from '@mui/material';
import * as FaIcons from 'react-icons/fa6';
import Logo from '@/components/shared/Logo';
import { footerNav, primaryNav } from '@/config/nav';
import { useAbout, useSocialLinks } from '@/hooks/usePublicData';

const resolveIcon = (iconName?: string | null) => {
  if (!iconName) return FaIcons.FaLink;
  const Icon = (FaIcons as unknown as Record<string, React.ComponentType<{ size?: number }>>)[
    `Fa${iconName.replace(/^Fa/, '')}`
  ];
  return Icon || FaIcons.FaLink;
};

export default function Footer() {
  const { data: about } = useAbout();
  const { data: socialLinks } = useSocialLinks();
  const year = new Date().getFullYear();

  return (
    <Box component="footer" sx={{ borderTop: '1px solid', borderColor: 'divider', mt: 12 }}>
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Grid container spacing={5}>
          <Grid item xs={12} md={4}>
            <Logo name={about?.fullName?.split(' ')[0] || 'Portfolio'} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2, maxWidth: 320 }}>
              {about?.tagline || 'Building data-driven products and thoughtful engineering.'}
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 3 }}>
              {(socialLinks || [])
                .filter((s) => s.isVisible)
                .map((social) => {
                  const Icon = resolveIcon(social.icon || social.platform);
                  return (
                    <IconButton
                      key={social.id}
                      component="a"
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.platform}
                      size="small"
                      sx={{ border: '1px solid', borderColor: 'divider' }}
                    >
                      <Icon size={15} />
                    </IconButton>
                  );
                })}
            </Stack>
          </Grid>

          <Grid item xs={6} md={4}>
            <Typography variant="overline" color="text.secondary">
              Navigate
            </Typography>
            <Stack spacing={1.1} sx={{ mt: 2 }}>
              {primaryNav.map((item) => (
                <Typography
                  key={item.href}
                  component={Link}
                  href={item.href}
                  variant="body2"
                  color="text.secondary"
                  sx={{ '&:hover': { color: 'primary.main' } }}
                >
                  {item.label}
                </Typography>
              ))}
            </Stack>
          </Grid>

          <Grid item xs={6} md={4}>
            <Typography variant="overline" color="text.secondary">
              More
            </Typography>
            <Stack spacing={1.1} sx={{ mt: 2 }}>
              {footerNav.map((item) => (
                <Typography
                  key={item.href}
                  component={Link}
                  href={item.href}
                  variant="body2"
                  color="text.secondary"
                  sx={{ '&:hover': { color: 'primary.main' } }}
                >
                  {item.label}
                </Typography>
              ))}
            </Stack>
          </Grid>
        </Grid>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          spacing={1}
          sx={{ mt: 6, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}
        >
          <Typography variant="caption" color="text.secondary" className="mono">
            © {year} {about?.fullName || 'Portfolio'}. All rights reserved.
          </Typography>
          <Typography variant="caption" color="text.secondary" className="mono">
            built with Next.js · Express · PostgreSQL
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
