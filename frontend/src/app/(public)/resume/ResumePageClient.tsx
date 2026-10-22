'use client';

import { Box, Typography, Button, Stack, Skeleton } from '@mui/material';
import { LuDownload, LuFileText } from 'react-icons/lu';
import Section from '@/components/shared/Section';
import PageHeader from '@/components/shared/PageHeader';
import EmptyState from '@/components/shared/EmptyState';
import Reveal from '@/components/shared/Reveal';
import { useResume } from '@/hooks/usePublicData';
import { resolveUploadUrl } from '@/lib/axios';

export default function ResumePageClient() {
  const { data: resume, isLoading } = useResume();
  const fileUrl = resume?.filePath ? resolveUploadUrl(resume.filePath) : null;

  return (
    <>
      <PageHeader eyebrow="> curl -O resume.pdf" title="Resume" description="Download a copy of my up-to-date resume." />
      <Section>
        {isLoading ? (
          <Skeleton variant="rounded" height={480} sx={{ borderRadius: 3 }} />
        ) : !fileUrl ? (
          <EmptyState title="Resume not uploaded yet" description="Check back soon, or reach out directly via the contact page." />
        ) : (
          <Reveal>
            <Stack spacing={3} alignItems="center">
              <Stack direction="row" spacing={2}>
                <Button component="a" href={fileUrl} target="_blank" rel="noopener noreferrer" variant="contained" size="large" startIcon={<LuDownload size={18} />}>
                  Download PDF
                </Button>
                <Button component="a" href={fileUrl} target="_blank" rel="noopener noreferrer" variant="outlined" size="large" startIcon={<LuFileText size={18} />}>
                  Open in new tab
                </Button>
              </Stack>

              <Box
                sx={{
                  width: '100%',
                  maxWidth: 820,
                  height: { xs: 500, md: 780 },
                  borderRadius: 3,
                  overflow: 'hidden',
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <iframe src={`${fileUrl}#view=FitH`} title="Resume preview" width="100%" height="100%" style={{ border: 'none' }} />
              </Box>

              {resume?.version && (
                <Typography variant="caption" className="mono" color="text.secondary">
                  last updated: {resume.version}
                </Typography>
              )}
            </Stack>
          </Reveal>
        )}
      </Section>
    </>
  );
}
