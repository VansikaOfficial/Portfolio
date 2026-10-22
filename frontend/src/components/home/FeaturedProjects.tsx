'use client';

import Link from 'next/link';
import { Grid, Button, Box } from '@mui/material';
import { LuArrowRight } from 'react-icons/lu';
import Section from '@/components/shared/Section';
import SectionHeading from '@/components/shared/SectionHeading';
import Reveal from '@/components/shared/Reveal';
import CardGridSkeleton from '@/components/shared/CardGridSkeleton';
import EmptyState from '@/components/shared/EmptyState';
import ProjectCard from '@/components/cards/ProjectCard';
import { useProjects } from '@/hooks/usePublicData';

export default function FeaturedProjects() {
  const { data: projects, isLoading } = useProjects({ featured: true });
  const list = projects && projects.length > 0 ? projects : [];

  return (
    <Section bordered>
      <SectionHeading
        eyebrow="03 · Selected work"
        title="Featured projects"
        description="A few projects I'm proud of — from data pipelines to deployed ML models."
      />

      {isLoading ? (
        <CardGridSkeleton count={3} />
      ) : list.length === 0 ? (
        <EmptyState title="Projects coming soon" description="Featured work will appear here once added." />
      ) : (
        <Grid container spacing={3}>
          {list.slice(0, 3).map((project, i) => (
            <Grid item xs={12} sm={6} md={4} key={project.id}>
              <Reveal delay={i * 0.08}>
                <ProjectCard project={project} />
              </Reveal>
            </Grid>
          ))}
        </Grid>
      )}

      <Box sx={{ mt: 4 }}>
        <Button component={Link} href="/projects" endIcon={<LuArrowRight size={16} />}>
          View all projects
        </Button>
      </Box>
    </Section>
  );
}
