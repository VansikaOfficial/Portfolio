'use client';

import { Grid } from '@mui/material';
import Section from '@/components/shared/Section';
import PageHeader from '@/components/shared/PageHeader';
import EmptyState from '@/components/shared/EmptyState';
import CardGridSkeleton from '@/components/shared/CardGridSkeleton';
import Reveal from '@/components/shared/Reveal';
import TestimonialCard from '@/components/cards/TestimonialCard';
import { useTestimonials } from '@/hooks/usePublicData';

export default function TestimonialsPageClient() {
  const { data: testimonials, isLoading } = useTestimonials();
  const list = (testimonials || []).filter((t) => t.isApproved);

  return (
    <>
      <PageHeader
        eyebrow="> grep -r 'thanks' ./inbox"
        title="Testimonials"
        description="What colleagues, clients, and collaborators have said about working with me."
      />
      <Section>
        {isLoading ? (
          <CardGridSkeleton count={6} minHeight={180} />
        ) : list.length === 0 ? (
          <EmptyState title="No testimonials yet" description="Kind words from collaborators will appear here." />
        ) : (
          <Grid container spacing={3}>
            {list.map((t, i) => (
              <Grid item xs={12} sm={6} md={4} key={t.id}>
                <Reveal delay={(i % 3) * 0.06}>
                  <TestimonialCard testimonial={t} />
                </Reveal>
              </Grid>
            ))}
          </Grid>
        )}
      </Section>
    </>
  );
}
