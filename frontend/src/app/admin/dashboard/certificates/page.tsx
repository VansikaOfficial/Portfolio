'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, TextField, Typography, Stack, Avatar } from '@mui/material';
import { LuPlus } from 'react-icons/lu';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminDataTable, { AdminColumn } from '@/components/admin/AdminDataTable';
import AdminFormDialog from '@/components/admin/AdminFormDialog';
import ImageUploadField from '@/components/admin/ImageUploadField';
import { confirmDelete, toastSuccess, toastError, extractErrorMessage } from '@/lib/adminAlerts';
import { createAdminCrud, uploadFile } from '@/lib/adminApi';
import { resolveUploadUrl } from '@/lib/axios';
import { Certificate } from '@/types';

const certificateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  issuer: z.string().max(150).optional(),
  issueDate: z.string().optional(),
  credentialUrl: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  displayOrder: z.number().int().default(0),
});
type CertificateFormInput = z.infer<typeof certificateSchema>;

const defaultValues: CertificateFormInput = {
  title: '',
  issuer: '',
  issueDate: '',
  credentialUrl: '',
  displayOrder: 0,
};

const client = createAdminCrud<Certificate>('certificates');

export default function CertificatesAdminPage() {
  const queryClient = useQueryClient();
  const { data: items, isLoading } = useQuery({ queryKey: ['admin-certificates'], queryFn: client.list });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-certificates'] });
    queryClient.invalidateQueries({ queryKey: ['certificates'] });
  };

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Certificate> }) => client.update(id, payload),
    onSuccess: () => {
      invalidate();
      toastSuccess('Updated successfully');
    },
    onError: (err) => toastError(extractErrorMessage(err, 'Failed to update')),
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => client.remove(id),
    onSuccess: () => {
      invalidate();
      toastSuccess('Deleted successfully');
    },
    onError: (err) => toastError(extractErrorMessage(err, 'Failed to delete')),
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Certificate | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingPreview, setPendingPreview] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<CertificateFormInput>({
    resolver: zodResolver(certificateSchema),
    defaultValues,
  });

  const openCreate = () => {
    setEditing(null);
    setPendingFile(null);
    setPendingPreview(null);
    reset(defaultValues);
    setDialogOpen(true);
  };

  const openEdit = (cert: Certificate) => {
    setEditing(cert);
    setPendingFile(null);
    setPendingPreview(null);
    reset({
      title: cert.title,
      issuer: cert.issuer || '',
      issueDate: cert.issueDate?.slice(0, 10) || '',
      credentialUrl: cert.credentialUrl || '',
      displayOrder: cert.displayOrder,
    });
    setDialogOpen(true);
  };

  const onSubmit = async (values: CertificateFormInput) => {
    if (editing) {
      await updateMutation.mutateAsync({ id: editing.id, payload: values });
      setDialogOpen(false);
      return;
    }

    if (!pendingFile) {
      toastError('Please select a certificate image');
      return;
    }

    setIsCreating(true);
    try {
      await uploadFile<Certificate>('/certificates', 'post', 'image', pendingFile, values);
      invalidate();
      toastSuccess('Certificate created');
      setDialogOpen(false);
    } catch (err) {
      toastError(extractErrorMessage(err, 'Failed to create certificate'));
    } finally {
      setIsCreating(false);
    }
  };

  const handleReplaceImage = async (file: File) => {
    if (!editing) return;
    try {
      const updated = await uploadFile<Certificate>(`/certificates/${editing.id}/image`, 'post', 'image', file);
      setEditing(updated);
      invalidate();
      toastSuccess('Image replaced');
    } catch (err) {
      toastError(extractErrorMessage(err, 'Failed to replace image'));
    }
  };

  const handlePendingFileSelect = async (file: File) => {
    setPendingFile(file);
    setPendingPreview(URL.createObjectURL(file));
  };

  const onDelete = async (cert: Certificate) => {
    if (await confirmDelete(`"${cert.title}"`)) {
      await removeMutation.mutateAsync(cert.id);
    }
  };

  const columns: AdminColumn<Certificate>[] = [
    {
      header: '',
      width: 56,
      render: (c) => <Avatar variant="rounded" src={resolveUploadUrl(c.image)} sx={{ width: 40, height: 40 }} />,
    },
    { header: 'Title', render: (c) => <Typography fontWeight={600}>{c.title}</Typography> },
    { header: 'Issuer', render: (c) => c.issuer || '—' },
  ];

  return (
    <>
      <AdminPageHeader
        title="Certificates"
        description="Manage certificates and credentials shown on the public site."
        action={
          <Button variant="contained" startIcon={<LuPlus size={16} />} onClick={openCreate}>
            Add certificate
          </Button>
        }
      />

      <AdminDataTable columns={columns} rows={items || []} isLoading={isLoading} onEdit={openEdit} onDelete={onDelete} />

      <AdminFormDialog
        open={dialogOpen}
        title={editing ? 'Edit certificate' : 'Add certificate'}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit(onSubmit)}
        isSaving={updateMutation.isPending || isCreating}
      >
        <TextField label="Title" fullWidth {...register('title')} error={!!errors.title} helperText={errors.title?.message} />
        <Stack direction="row" spacing={2}>
          <TextField label="Issuer" fullWidth {...register('issuer')} />
          <TextField label="Issue date" type="date" fullWidth InputLabelProps={{ shrink: true }} {...register('issueDate')} />
        </Stack>
        <TextField label="Credential URL" fullWidth {...register('credentialUrl')} error={!!errors.credentialUrl} helperText={errors.credentialUrl?.message} />
        <Controller
          name="displayOrder"
          control={control}
          render={({ field }) => (
            <TextField label="Display order" type="number" fullWidth value={field.value} onChange={(e) => field.onChange(Number(e.target.value))} />
          )}
        />

        {editing ? (
          <ImageUploadField
            label="Certificate image"
            currentImageUrl={resolveUploadUrl(editing.image)}
            onUpload={handleReplaceImage}
          />
        ) : (
          <ImageUploadField
            label="Certificate image (required)"
            currentImageUrl={pendingPreview}
            onUpload={handlePendingFileSelect}
            helperText="This image uploads together with the form when you click Save."
          />
        )}
      </AdminFormDialog>
    </>
  );
}
