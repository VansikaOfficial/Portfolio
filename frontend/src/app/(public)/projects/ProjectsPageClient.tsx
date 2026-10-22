'use client';

import { useState } from 'react';
import { Grid, Tabs, Tab } from '@mui/material';
import Section from '@/components/shared/Section';
import PageHeader from '@/components/shared/PageHeader';
import CardGridSkeleton from '@/components/shared/CardGridSkeleton';
import EmptyState from '@/components/shared/EmptyState';
import Reveal from '@/components/shared/Reveal';
import ProjectCard from '@/components/cards/ProjectCard';
import { useProjects } from '@/hooks/usePublicData';

const FILTERS = [
  { label: 'All', value: undefined },
  { label: 'Completed', value: 'completed' },
  { label: 'In progress', value: 'in_progress' },
  { label: 'Archived', value: 'archived' },
] as const;

export default function ProjectsPageClient() {
  const [status, setStatus] = useState<string | undefined>(undefined);
  const { data: projects, isLoading } = useProjects({ status });
  const list = projects || [];

  return (
    <>
      <PageHeader
        eyebrow="> ls -la ./projects"
        title="Projects"
        description="A collection of things I've built — data pipelines, dashboards, and machine learning systems."
      />
      <Section>
        <Tabs
          value={status || 'all'}
          onChange={(_, v) => setStatus(v === 'all' ? undefined : v)}
          sx={{ mb: 4 }}
          variant="scrollable"
          scrollButtons="auto"
        >
          {FILTERS.map((f) => (
            <Tab key={f.label} label={f.label} value={f.value || 'all'} />
          ))}
        </Tabs>

        {isLoading ? (
          <CardGridSkeleton count={6} />
        ) : list.length === 0 ? (
          <EmptyState title="No projects found" description="Try a different filter, or check back soon." />
        ) : (
          <Grid container spacing={3}>
            {list.map((project, i) => (
              <Grid item xs={12} sm={6} md={4} key={project.id}>
                <Reveal delay={(i % 3) * 0.06}>
                  <ProjectCard project={project} />
                </Reveal>
              </Grid>
            ))}
          </Grid>
        )}
      </Section>
    </>
  );
}
