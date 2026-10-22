'use client';

import Link from 'next/link';
import { Grid, Button, Box } from '@mui/material';
import { LuArrowRight } from 'react-icons/lu';
import Section from '@/components/shared/Section';
import SectionHeading from '@/components/shared/SectionHeading';
import Reveal from '@/components/shared/Reveal';
import SkillBar from '@/components/cards/SkillBar';
import { useSkills } from '@/hooks/usePublicData';

export default function SkillsPreview() {
  const { data: skills } = useSkills();

  if (!skills || skills.length === 0) return null;

  const top = [...skills].sort((a, b) => b.percentage - a.percentage).slice(0, 6);
  const half = Math.ceil(top.length / 2);

  return (
    <Section bordered>
      <SectionHeading
        eyebrow="02 · Skills"
        title="Tools I reach for"
        description="A snapshot of the languages, frameworks, and platforms I use most."
      />

      <Grid container spacing={6}>
        <Grid item xs={12} md={6}>
          <Reveal>
            {top.slice(0, half).map((skill) => (
              <SkillBar key={skill.id} skill={skill} />
            ))}
          </Reveal>
        </Grid>
        <Grid item xs={12} md={6}>
          <Reveal delay={0.1}>
            {top.slice(half).map((skill) => (
              <SkillBar key={skill.id} skill={skill} />
            ))}
          </Reveal>
        </Grid>
      </Grid>

      <Box sx={{ mt: 2 }}>
        <Button component={Link} href="/skills" endIcon={<LuArrowRight size={16} />}>
          See the full skill set
        </Button>
      </Box>
    </Section>
  );
}
