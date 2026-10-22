'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import { LuExpand } from 'react-icons/lu';
import Section from '@/components/shared/Section';
import PageHeader from '@/components/shared/PageHeader';
import EmptyState from '@/components/shared/EmptyState';
import CardGridSkeleton from '@/components/shared/CardGridSkeleton';
import Reveal from '@/components/shared/Reveal';
import Lightbox from '@/components/shared/Lightbox';
import { useCertificates } from '@/hooks/usePublicData';
import { resolveUploadUrl } from '@/lib/axios';

export default function CertificatesPageClient() {
  const { data: certificates, isLoading } = useCertificates();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const list = certificates || [];

  const images = list.map((c) => ({
    src: resolveUploadUrl(c.image),
    title: c.title,
    caption: c.issuer || undefined,
  }));

  return (
    <>
      <PageHeader
        eyebrow="> unzip certificates.zip"
        title="Certificates"
        description="Courses, specializations, and credentials I've completed."
      />
      <Section>
        {isLoading ? (
          <CardGridSkeleton count={6} minHeight={200} />
        ) : list.length === 0 ? (
          <EmptyState title="No certificates added yet" description="Certificates will appear here once uploaded." />
        ) : (
          <Grid container spacing={3}>
            {list.map((cert, i) => (
              <Grid item xs={12} sm={6} md={4} key={cert.id}>
                <Reveal delay={(i % 3) * 0.06}>
                  <Card
                    variant="outlined"
                    onClick={() => setActiveIndex(i)}
                    sx={{ cursor: 'pointer', '&:hover': { borderColor: 'primary.main' } }}
                  >
                    <Box sx={{ position: 'relative', aspectRatio: '4/3', bgcolor: 'action.hover' }}>
                      <Image src={resolveUploadUrl(cert.image)} alt={cert.title} fill style={{ objectFit: 'cover' }} loading="lazy" />
                      <Box
                        sx={{
                          position: 'absolute',
                          inset: 0,
                          display: 'grid',
                          placeItems: 'center',
                          opacity: 0,
                          bgcolor: 'rgba(0,0,0,0.35)',
                          transition: 'opacity 200ms ease',
                          '.MuiCard-root:hover &': { opacity: 1 },
                        }}
                      >
                        <LuExpand size={22} color="white" />
                      </Box>
                    </Box>
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight={700}>
                        {cert.title}
                      </Typography>
                      {cert.issuer && (
                        <Typography variant="body2" color="text.secondary">
                          {cert.issuer}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Reveal>
              </Grid>
            ))}
          </Grid>
        )}
      </Section>

      <Lightbox images={images} index={activeIndex} onClose={() => setActiveIndex(null)} onNavigate={setActiveIndex} />
    </>
  );
}
