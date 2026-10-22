'use client';

import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container, Grid, Typography, Stack, Chip, Button, Box, Skeleton } from '@mui/material';
import { LuGithub, LuExternalLink, LuArrowLeft } from 'react-icons/lu';
import Section from '@/components/shared/Section';
import Reveal from '@/components/shared/Reveal';
import { useProjectBySlug } from '@/hooks/usePublicData';
import { resolveUploadUrl } from '@/lib/axios';

const STATUS_LABEL: Record<string, string> = {
  in_progress: 'In progress',
  completed: 'Completed',
  archived: 'Archived',
};

export default function ProjectDetailClient({ slug }: { slug: string }) {
  const { data: project, isLoading, isError } = useProjectBySlug(slug);

  if (isError) notFound();

  return (
    <Section>
      <Container maxWidth="md" disableGutters>
        <Button component={Link} href="/projects" startIcon={<LuArrowLeft size={16} />} sx={{ mb: 3 }} color="inherit">
          Back to projects
        </Button>

        {isLoading || !project ? (
          <>
            <Skeleton variant="text" height={60} width="70%" />
            <Skeleton variant="rounded" height={320} sx={{ mt: 2, borderRadius: 3 }} />
          </>
        ) : (
          <Reveal>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
              <Chip label={STATUS_LABEL[project.status]} size="small" color="primary" variant="outlined" />
              {project.featured && <Chip label="Featured" size="small" color="secondary" />}
            </Stack>

            <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.75rem' }, mb: 2 }}>
              {project.title}
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem', mb: 3 }}>
              {project.description}
            </Typography>

            <Stack direction="row" spacing={1.5} sx={{ mb: 4 }}>
              {project.githubLink && (
                <Button
                  component="a"
                  href={project.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outlined"
                  startIcon={<LuGithub size={16} />}
                >
                  Source code
                </Button>
              )}
              {project.liveDemoLink && (
                <Button
                  component="a"
                  href={project.liveDemoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="contained"
                  startIcon={<LuExternalLink size={16} />}
                >
                  Live demo
                </Button>
              )}
            </Stack>

            {project.thumbnail && (
              <Box sx={{ position: 'relative', width: '100%', aspectRatio: '16/9', borderRadius: 3, overflow: 'hidden', mb: 4 }}>
                <Image src={resolveUploadUrl(project.thumbnail)} alt={project.title} fill style={{ objectFit: 'cover' }} priority />
              </Box>
            )}

            {project.longDescription && (
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.9, mb: 4, whiteSpace: 'pre-line' }}>
                {project.longDescription}
              </Typography>
            )}

            {project.techStack.length > 0 && (
              <>
                <Typography variant="overline" className="mono" color="text.secondary">
                  Tech stack
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 1, mb: 4, flexWrap: 'wrap', gap: 1 }}>
                  {project.techStack.map((tech) => (
                    <Chip key={tech} label={tech} variant="outlined" />
                  ))}
                </Stack>
              </>
            )}

            {project.images.length > 0 && (
              <Grid container spacing={2}>
                {project.images.map((img, i) => (
                  <Grid item xs={12} sm={6} key={i}>
                    <Box sx={{ position: 'relative', width: '100%', aspectRatio: '4/3', borderRadius: 2, overflow: 'hidden' }}>
                      <Image src={resolveUploadUrl(img)} alt={`${project.title} screenshot ${i + 1}`} fill style={{ objectFit: 'cover' }} />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            )}
          </Reveal>
        )}
      </Container>
    </Section>
  );
}
