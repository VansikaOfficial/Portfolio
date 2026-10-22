'use client';

import Link from 'next/link';
import { Box, Container, Grid, Stack, Typography, Button, Chip, Avatar } from '@mui/material';
import { motion } from 'framer-motion';
import { LuArrowUpRight, LuDownload, LuCircleDot } from 'react-icons/lu';
import TypingRoles from './TypingRoles';
import DataPulse from './DataPulse';
import { useAbout, useResume } from '@/hooks/usePublicData';
import { resolveUploadUrl } from '@/lib/axios';

export default function Hero() {
  const { data: about, isLoading } = useAbout();
  const { data: resume } = useResume();

  return (
    <Box sx={{ position: 'relative', overflow: 'hidden', pt: { xs: 6, md: 4 }, pb: { xs: 8, md: 10 } }}>
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={7}>
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <Chip
                icon={<LuCircleDot size={13} />}
                label={isLoading ? 'loading...' : about?.currentStatus || 'Open to opportunities'}
                size="small"
                sx={{
                  bgcolor: 'transparent',
                  border: '1px solid',
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  mb: 3,
                  '& .MuiChip-icon': { color: 'success.main' },
                }}
              />

              <Typography
                className="mono"
                variant="overline"
                sx={{ color: 'text.secondary', display: 'block', mb: 1 }}
              >
                {'> whoami'}
              </Typography>

              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.4rem', sm: '3rem', md: '3.6rem' },
                  lineHeight: 1.08,
                  mb: 1.5,
                }}
              >
                {about?.fullName || 'Your Name'}
              </Typography>

              <TypingRoles roles={about?.roles} />

              <Typography variant="body1" color="text.secondary" sx={{ mt: 3, maxWidth: 520, fontSize: '1.05rem' }}>
                {about?.tagline || 'I turn messy data into clear, actionable stories — and build the systems that keep them that way.'}
              </Typography>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 4.5 }}>
                <Button
                  component={Link}
                  href="/contact"
                  variant="contained"
                  size="large"
                  endIcon={<LuArrowUpRight size={18} />}
                >
                  Hire me
                </Button>
                <Button
                  component="a"
                  href={resume?.filePath ? resolveUploadUrl(resume.filePath) : '#'}
                  target={resume?.filePath ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  variant="outlined"
                  size="large"
                  startIcon={<LuDownload size={18} />}
                  disabled={!resume?.filePath}
                >
                  Download resume
                </Button>
                <Button component={Link} href="/projects" size="large" color="inherit">
                  View projects
                </Button>
              </Stack>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={5}>
            <Stack alignItems="center" spacing={3}>
              {about?.profilePhoto && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.15 }}
                >
                  <Avatar
                    src={resolveUploadUrl(about.profilePhoto)}
                    alt={about.fullName}
                    sx={{
                      width: { xs: 140, md: 170 },
                      height: { xs: 140, md: 170 },
                      border: '3px solid',
                      borderColor: 'primary.main',
                    }}
                  />
                </motion.div>
              )}
              <DataPulse />
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
