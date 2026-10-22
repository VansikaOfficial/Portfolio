'use client';

import { useRef, useState } from 'react';
import { Box, Button, Stack, Typography, CircularProgress } from '@mui/material';
import { LuUpload, LuImage } from 'react-icons/lu';
import Image from 'next/image';

export default function ImageUploadField({
  label,
  currentImageUrl,
  onUpload,
  disabled,
  aspectRatio = '4/3',
  helperText,
}: {
  label: string;
  currentImageUrl?: string | null;
  onUpload: (file: File) => Promise<void>;
  disabled?: boolean;
  aspectRatio?: string;
  helperText?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);
    setUploading(true);
    try {
      await onUpload(file);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const displayUrl = preview || currentImageUrl;

  return (
    <Box>
      <Typography variant="body2" sx={{ mb: 1 }}>
        {label}
      </Typography>
      <Stack direction="row" spacing={2} alignItems="center">
        <Box
          sx={{
            position: 'relative',
            width: 96,
            aspectRatio,
            borderRadius: 2,
            overflow: 'hidden',
            bgcolor: 'action.hover',
            border: '1px solid',
            borderColor: 'divider',
            flexShrink: 0,
            display: 'grid',
            placeItems: 'center',
          }}
        >
          {displayUrl ? (
            <Image src={displayUrl} alt={label} fill style={{ objectFit: 'cover' }} unoptimized={!!preview} />
          ) : (
            <LuImage size={22} style={{ opacity: 0.4 }} />
          )}
          {uploading && (
            <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.4)', display: 'grid', placeItems: 'center' }}>
              <CircularProgress size={20} sx={{ color: 'white' }} />
            </Box>
          )}
        </Box>

        <Stack spacing={0.75}>
          <Button
            component="label"
            variant="outlined"
            size="small"
            startIcon={<LuUpload size={14} />}
            disabled={disabled || uploading}
          >
            {currentImageUrl || preview ? 'Replace image' : 'Upload image'}
            <input ref={inputRef} type="file" accept="image/*" hidden onChange={handleFileChange} />
          </Button>
          {helperText && (
            <Typography variant="caption" color="text.secondary">
              {helperText}
            </Typography>
          )}
        </Stack>
      </Stack>
    </Box>
  );
}
