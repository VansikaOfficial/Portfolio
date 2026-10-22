'use client';

import { Grid } from '@mui/material';
import Section from '@/components/shared/Section';
import SectionHeading from '@/components/shared/SectionHeading';
import Reveal from '@/components/shared/Reveal';
import TestimonialCard from '@/components/cards/TestimonialCard';
import { useTestimonials } from '@/hooks/usePublicData';

export default function TestimonialsPreview() {
  const { data: testimonials } = useTestimonials();
  const approved = (testimonials || []).filter((t) => t.isApproved).slice(0, 3);

  if (approved.length === 0) return null;

  return (
    <Section bordered>
      <SectionHeading eyebrow="04 · Kind words" title="What people say" />
      <Grid container spacing={3}>
        {approved.map((t, i) => (
          <Grid item xs={12} md={4} key={t.id}>
            <Reveal delay={i * 0.08}>
              <TestimonialCard testimonial={t} />
            </Reveal>
          </Grid>
        ))}
      </Grid>
    </Section>
  );
}
