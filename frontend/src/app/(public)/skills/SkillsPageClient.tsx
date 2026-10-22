'use client';

import { Grid, Typography, Box } from '@mui/material';
import Section from '@/components/shared/Section';
import PageHeader from '@/components/shared/PageHeader';
import Reveal from '@/components/shared/Reveal';
import EmptyState from '@/components/shared/EmptyState';
import SkillBar from '@/components/cards/SkillBar';
import { useSkills } from '@/hooks/usePublicData';
import { Skill, SkillCategory } from '@/types';

const CATEGORY_ORDER: SkillCategory[] = [
  'Programming',
  'Machine Learning',
  'Deep Learning',
  'Databases',
  'Visualization',
  'Cloud',
  'Frameworks',
  'Tools',
  'Soft Skills',
];

const groupByCategory = (skills: Skill[]) => {
  const groups: Record<string, Skill[]> = {};
  skills.forEach((s) => {
    if (!groups[s.category]) groups[s.category] = [];
    groups[s.category].push(s);
  });
  return groups;
};

export default function SkillsPageClient() {
  const { data: skills, isLoading } = useSkills();

  const groups = skills ? groupByCategory(skills) : {};
  const categories = CATEGORY_ORDER.filter((c) => groups[c]?.length);

  return (
    <>
      <PageHeader
        eyebrow="> ls ./skills"
        title="Skills & tools"
        description="Technologies I use daily, grouped by category with proficiency levels."
      />

      <Section>
        {isLoading ? (
          <Typography color="text.secondary">Loading skills…</Typography>
        ) : categories.length === 0 ? (
          <EmptyState title="No skills added yet" description="Skills will appear here once added from the dashboard." />
        ) : (
          <Grid container spacing={{ xs: 5, md: 6 }}>
            {categories.map((category, i) => (
              <Grid item xs={12} md={6} key={category}>
                <Reveal delay={(i % 2) * 0.08}>
                  <Box sx={{ mb: 2.5 }}>
                    <Typography
                      className="mono"
                      variant="overline"
                      color="text.secondary"
                      sx={{ display: 'block', mb: 2 }}
                    >
                      {category}
                    </Typography>
                    {groups[category].map((skill) => (
                      <SkillBar key={skill.id} skill={skill} />
                    ))}
                  </Box>
                </Reveal>
              </Grid>
            ))}
          </Grid>
        )}
      </Section>
    </>
  );
}
