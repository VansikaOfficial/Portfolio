'use client';

import Section from '@/components/shared/Section';
import PageHeader from '@/components/shared/PageHeader';
import EmptyState from '@/components/shared/EmptyState';
import TimelineList from '@/components/shared/TimelineList';
import { useEducation } from '@/hooks/usePublicData';

export default function EducationPageClient() {
  const { data: education, isLoading } = useEducation();

  const entries = (education || []).map((e) => ({
    id: e.id,
    title: e.degree,
    subtitle: e.institution + (e.fieldOfStudy ? ` · ${e.fieldOfStudy}` : ''),
    period: `${e.startYear} — ${e.endYear || 'Present'}`,
    badge: e.cgpa ? `CGPA ${e.cgpa}` : e.percentage ? `${e.percentage}` : undefined,
    bullets: e.description ? [e.description] : [],
  }));

  return (
    <>
      <PageHeader
        eyebrow="> cat education.log"
        title="Education"
        description="Academic background and qualifications."
      />
      <Section>
        {isLoading ? null : entries.length === 0 ? (
          <EmptyState title="No education added yet" description="Academic history will appear here once added." />
        ) : (
          <TimelineList entries={entries} />
        )}
      </Section>
    </>
  );
}
