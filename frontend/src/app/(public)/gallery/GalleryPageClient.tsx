'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Box } from '@mui/material';
import Section from '@/components/shared/Section';
import PageHeader from '@/components/shared/PageHeader';
import EmptyState from '@/components/shared/EmptyState';
import Reveal from '@/components/shared/Reveal';
import Lightbox from '@/components/shared/Lightbox';
import { useGallery } from '@/hooks/usePublicData';
import { resolveUploadUrl } from '@/lib/axios';

export default function GalleryPageClient() {
  const { data: gallery, isLoading } = useGallery();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const list = gallery || [];

  const images = list.map((g) => ({
    src: resolveUploadUrl(g.image),
    title: g.title || undefined,
    caption: g.caption || undefined,
  }));

  return (
    <>
      <PageHeader eyebrow="> open ./gallery" title="Gallery" description="Moments, snapshots, and behind-the-scenes." />
      <Section>
        {isLoading ? null : list.length === 0 ? (
          <EmptyState title="No images yet" description="Gallery photos will appear here once uploaded." />
        ) : (
          <Box
            sx={{
              columnCount: { xs: 2, sm: 3, md: 4 },
              columnGap: 2,
            }}
          >
            {list.map((item, i) => (
              <Reveal key={item.id} delay={(i % 8) * 0.04} className="gallery-item">
                <Box
                  onClick={() => setActiveIndex(i)}
                  sx={{
                    position: 'relative',
                    mb: 2,
                    borderRadius: 2,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    breakInside: 'avoid',
                    '&:hover img': { transform: 'scale(1.04)' },
                  }}
                >
                  <Image
                    src={resolveUploadUrl(item.image)}
                    alt={item.title || 'Gallery image'}
                    width={400}
                    height={400 + (i % 3) * 60}
                    style={{ width: '100%', height: 'auto', display: 'block', transition: 'transform 300ms ease' }}
                    loading="lazy"
                  />
                </Box>
              </Reveal>
            ))}
          </Box>
        )}
      </Section>

      <Lightbox images={images} index={activeIndex} onClose={() => setActiveIndex(null)} onNavigate={setActiveIndex} />
    </>
  );
}
