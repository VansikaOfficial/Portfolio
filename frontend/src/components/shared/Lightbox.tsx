'use client';

import { useState } from 'react';
import { Modal, Box, IconButton, Typography, Fade } from '@mui/material';
import Image from 'next/image';
import { LuX, LuChevronLeft, LuChevronRight, LuZoomIn } from 'react-icons/lu';

export interface LightboxImage {
  src: string;
  title?: string;
  caption?: string;
}

export default function Lightbox({
  images,
  index,
  onClose,
  onNavigate,
}: {
  images: LightboxImage[];
  index: number | null;
  onClose: () => void;
  onNavigate: (nextIndex: number) => void;
}) {
  const [zoomed, setZoomed] = useState(false);
  const open = index !== null;
  const current = index !== null ? images[index] : null;

  const handleClose = () => {
    setZoomed(false);
    onClose();
  };

  const go = (delta: number) => {
    if (index === null) return;
    setZoomed(false);
    const next = (index + delta + images.length) % images.length;
    onNavigate(next);
  };

  return (
    <Modal open={open} onClose={handleClose} closeAfterTransition sx={{ display: 'grid', placeItems: 'center' }}>
      <Fade in={open}>
        <Box
          sx={{
            position: 'relative',
            width: '92vw',
            height: '86vh',
            maxWidth: 1100,
            outline: 'none',
          }}
        >
          <IconButton
            onClick={handleClose}
            sx={{ position: 'absolute', top: -48, right: 0, color: 'white' }}
            aria-label="Close preview"
          >
            <LuX size={24} />
          </IconButton>

          {images.length > 1 && (
            <>
              <IconButton
                onClick={() => go(-1)}
                sx={{ position: 'absolute', left: { xs: -8, md: -56 }, top: '50%', transform: 'translateY(-50%)', color: 'white' }}
                aria-label="Previous image"
              >
                <LuChevronLeft size={28} />
              </IconButton>
              <IconButton
                onClick={() => go(1)}
                sx={{ position: 'absolute', right: { xs: -8, md: -56 }, top: '50%', transform: 'translateY(-50%)', color: 'white' }}
                aria-label="Next image"
              >
                <LuChevronRight size={28} />
              </IconButton>
            </>
          )}

          {current && (
            <Box
              onClick={() => setZoomed((z) => !z)}
              sx={{
                position: 'relative',
                width: '100%',
                height: '100%',
                borderRadius: 2,
                overflow: zoomed ? 'auto' : 'hidden',
                cursor: zoomed ? 'zoom-out' : 'zoom-in',
                bgcolor: 'rgba(0,0,0,0.3)',
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  width: zoomed ? '160%' : '100%',
                  height: zoomed ? '160%' : '100%',
                  transition: 'width 200ms ease, height 200ms ease',
                }}
              >
                <Image src={current.src} alt={current.title || 'Preview'} fill style={{ objectFit: 'contain' }} sizes="90vw" />
              </Box>
              {!zoomed && (
                <IconButton
                  size="small"
                  sx={{ position: 'absolute', bottom: 12, right: 12, color: 'white', bgcolor: 'rgba(0,0,0,0.4)' }}
                  aria-label="Zoom"
                >
                  <LuZoomIn size={16} />
                </IconButton>
              )}
            </Box>
          )}

          {current?.title && (
            <Typography variant="subtitle1" sx={{ color: 'white', mt: 1.5, textAlign: 'center' }}>
              {current.title}
            </Typography>
          )}
          {current?.caption && (
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center' }}>
              {current.caption}
            </Typography>
          )}
        </Box>
      </Fade>
    </Modal>
  );
}
