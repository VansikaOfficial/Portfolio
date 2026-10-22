'use client';

import { useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, Stack, Typography, Button, Box, CircularProgress } from '@mui/material';
import { LuUpload, LuFileText, LuTrash2, LuExternalLink } from 'react-icons/lu';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import { confirmDelete, toastSuccess, toastError, extractErrorMessage } from '@/lib/adminAlerts';
import { api, resolveUploadUrl } from '@/lib/axios';
import { Resume } from '@/types';

export default function ResumeAdminPage() {
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const { data: resume, isLoading } = useQuery({
    queryKey: ['admin-resume'],
    queryFn: () => api.get('/resume').then((r) => r.data.data as Resume),
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-resume'] });
    queryClient.invalidateQueries({ queryKey: ['resume'] });
  };

  const removeMutation = useMutation({
    mutationFn: () => api.delete('/resume').then((r) => r.data.data as Resume),
    onSuccess: () => {
      invalidate();
      toastSuccess('Resume removed');
    },
    onError: (err) => toastError(extractErrorMessage(err, 'Failed to remove resume')),
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('resume', file);
      await api.post('/resume', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      invalidate();
      toastSuccess('Resume uploaded');
    } catch (err) {
      toastError(extractErrorMessage(err, 'Failed to upload resume'));
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleRemove = async () => {
    if (await confirmDelete('the current resume')) {
      await removeMutation.mutateAsync();
    }
  };

  const fileUrl = resume?.filePath ? resolveUploadUrl(resume.filePath) : null;

  return (
    <>
      <AdminPageHeader title="Resume" description="Upload the PDF shown on your public Resume page and used by the Hero download button." />

      <Card variant="outlined">
        <CardContent sx={{ p: 4 }}>
          {isLoading ? (
            <Typography color="text.secondary">Loading…</Typography>
          ) : (
            <Stack alignItems="center" spacing={2.5} sx={{ py: fileUrl ? 3 : 5 }}>
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: 3,
                  display: 'grid',
                  placeItems: 'center',
                  bgcolor: 'action.hover',
                  color: 'primary.main',
                }}
              >
                <LuFileText size={28} />
              </Box>

              {fileUrl ? (
                <>
                  <Typography variant="subtitle1" fontWeight={700}>
                    {resume?.originalName || 'resume.pdf'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Last updated: {resume?.version || '—'}
                  </Typography>
                  <Stack direction="row" spacing={1.5}>
                    <Button component="a" href={fileUrl} target="_blank" rel="noopener noreferrer" variant="outlined" startIcon={<LuExternalLink size={16} />}>
                      View
                    </Button>
                    <Button component="label" variant="contained" startIcon={uploading ? <CircularProgress size={16} color="inherit" /> : <LuUpload size={16} />} disabled={uploading}>
                      {uploading ? 'Uploading…' : 'Replace'}
                      <input ref={inputRef} type="file" accept="application/pdf" hidden onChange={handleUpload} />
                    </Button>
                    <Button variant="outlined" color="error" startIcon={<LuTrash2 size={16} />} onClick={handleRemove} disabled={removeMutation.isPending}>
                      Remove
                    </Button>
                  </Stack>
                </>
              ) : (
                <>
                  <Typography variant="body1" color="text.secondary">
                    No resume uploaded yet.
                  </Typography>
                  <Button component="label" variant="contained" startIcon={uploading ? <CircularProgress size={16} color="inherit" /> : <LuUpload size={16} />} disabled={uploading}>
                    {uploading ? 'Uploading…' : 'Upload PDF'}
                    <input ref={inputRef} type="file" accept="application/pdf" hidden onChange={handleUpload} />
                  </Button>
                </>
              )}
            </Stack>
          )}
        </CardContent>
      </Card>
    </>
  );
}
