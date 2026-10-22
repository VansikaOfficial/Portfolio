'use client';

import Section from '@/components/shared/Section';
import PageHeader from '@/components/shared/PageHeader';
import EmptyState from '@/components/shared/EmptyState';
import TimelineList from '@/components/shared/TimelineList';
import { useExperience } from '@/hooks/usePublicData';

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

export default function ExperiencePageClient() {
  const { data: experience, isLoading } = useExperience();

  const entries = (experience || []).map((e) => ({
    id: e.id,
    title: e.role,
    subtitle: e.company,
    period: `${formatDate(e.startDate)} — ${e.isCurrent ? 'Present' : e.endDate ? formatDate(e.endDate) : ''}`,
    location: e.location,
    badge: e.isCurrent ? 'Current' : undefined,
    bullets: e.responsibilities,
    tags: e.skillsUsed,
  }));

  return (
    <>
      <PageHeader
        eyebrow="> git log --experience"
        title="Experience"
        description="Where I've worked and what I was responsible for."
      />
      <Section>
        {isLoading ? null : entries.length === 0 ? (
          <EmptyState title="No experience added yet" description="Work history will appear here once added." />
        ) : (
          <TimelineList entries={entries} />
        )}
      </Section>
    </>
  );
}
