'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, Box, Typography, Stack, Chip, IconButton } from '@mui/material';
import { LuGithub, LuExternalLink, LuArrowUpRight } from 'react-icons/lu';
import { Project } from '@/types';
import { resolveUploadUrl } from '@/lib/axios';

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Card
      variant="outlined"
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        '&:hover': { borderColor: 'primary.main', transform: 'translateY(-4px)' },
      }}
    >
      <Box
        component={Link}
        href={`/projects/${project.slug}`}
        sx={{
          position: 'relative',
          aspectRatio: '16/10',
          bgcolor: 'action.hover',
          overflow: 'hidden',
          display: 'block',
        }}
      >
        {project.thumbnail ? (
          <Image
            src={resolveUploadUrl(project.thumbnail)}
            alt={project.title}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 768px) 100vw, 400px"
          />
        ) : (
          <Box sx={{ display: 'grid', placeItems: 'center', height: '100%', color: 'text.disabled' }}>
            <Typography className="mono" variant="caption">
              no preview
            </Typography>
          </Box>
        )}
        {project.featured && (
          <Chip
            label="Featured"
            size="small"
            color="secondary"
            sx={{ position: 'absolute', top: 12, left: 12 }}
          />
        )}
      </Box>

      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography
          component={Link}
          href={`/projects/${project.slug}`}
          variant="h6"
          sx={{ fontSize: '1.1rem', mb: 0.75, '&:hover': { color: 'primary.main' } }}
        >
          {project.title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {project.description}
        </Typography>

        <Stack direction="row" spacing={0.75} sx={{ flexWrap: 'wrap', gap: 0.75, mb: 2 }}>
          {project.techStack.slice(0, 4).map((tech) => (
            <Chip key={tech} label={tech} size="small" variant="outlined" />
          ))}
        </Stack>

        <Stack direction="row" spacing={1} sx={{ mt: 'auto', alignItems: 'center' }}>
          {project.githubLink && (
            <IconButton
              component="a"
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              size="small"
              aria-label="View source on GitHub"
            >
              <LuGithub size={16} />
            </IconButton>
          )}
          {project.liveDemoLink && (
            <IconButton
              component="a"
              href={project.liveDemoLink}
              target="_blank"
              rel="noopener noreferrer"
              size="small"
              aria-label="View live demo"
            >
              <LuExternalLink size={16} />
            </IconButton>
          )}
          <Box sx={{ flex: 1 }} />
          <Typography
            component={Link}
            href={`/projects/${project.slug}`}
            variant="caption"
            className="mono"
            sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.4, color: 'primary.main' }}
          >
            details <LuArrowUpRight size={12} />
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
