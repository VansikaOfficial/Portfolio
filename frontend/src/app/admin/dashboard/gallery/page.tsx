'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, TextField, Typography, Avatar } from '@mui/material';
import { LuPlus } from 'react-icons/lu';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminDataTable, { AdminColumn } from '@/components/admin/AdminDataTable';
import AdminFormDialog from '@/components/admin/AdminFormDialog';
import ImageUploadField from '@/components/admin/ImageUploadField';
import { confirmDelete, toastSuccess, toastError, extractErrorMessage } from '@/lib/adminAlerts';
import { createAdminCrud, uploadFile } from '@/lib/adminApi';
import { resolveUploadUrl } from '@/lib/axios';
import { GalleryItem } from '@/types';

const gallerySchema = z.object({
  title: z.string().max(200).optional(),
  caption: z.string().max(250).optional(),
  displayOrder: z.number().int().default(0),
});
type GalleryFormInput = z.infer<typeof gallerySchema>;

const defaultValues: GalleryFormInput = { title: '', caption: '', displayOrder: 0 };

const client = createAdminCrud<GalleryItem>('gallery');

export default function GalleryAdminPage() {
  const queryClient = useQueryClient();
  const { data: items, isLoading } = useQuery({ queryKey: ['admin-gallery'], queryFn: client.list });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-gallery'] });
    queryClient.invalidateQueries({ queryKey: ['gallery'] });
  };

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<GalleryItem> }) => client.update(id, payload),
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
  const [editing, setEditing] = useState<GalleryItem | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingPreview, setPendingPreview] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const { register, handleSubmit, control, reset } = useForm<GalleryFormInput>({
    resolver: zodResolver(gallerySchema),
    defaultValues,
  });

  const openCreate = () => {
    setEditing(null);
    setPendingFile(null);
    setPendingPreview(null);
    reset(defaultValues);
    setDialogOpen(true);
  };

  const openEdit = (item: GalleryItem) => {
    setEditing(item);
    setPendingFile(null);
    setPendingPreview(null);
    reset({ title: item.title || '', caption: item.caption || '', displayOrder: item.displayOrder });
    setDialogOpen(true);
  };

  const onSubmit = async (values: GalleryFormInput) => {
    if (editing) {
      await updateMutation.mutateAsync({ id: editing.id, payload: values });
      setDialogOpen(false);
      return;
    }
    if (!pendingFile) {
      toastError('Please select an image');
      return;
    }
    setIsCreating(true);
    try {
      await uploadFile<GalleryItem>('/gallery', 'post', 'image', pendingFile, values);
      invalidate();
      toastSuccess('Gallery item created');
      setDialogOpen(false);
    } catch (err) {
      toastError(extractErrorMessage(err, 'Failed to create gallery item'));
    } finally {
      setIsCreating(false);
    }
  };

  const handlePendingFileSelect = async (file: File) => {
    setPendingFile(file);
    setPendingPreview(URL.createObjectURL(file));
  };

  const onDelete = async (item: GalleryItem) => {
    if (await confirmDelete(item.title ? `"${item.title}"` : 'this image')) {
      await removeMutation.mutateAsync(item.id);
    }
  };

  const columns: AdminColumn<GalleryItem>[] = [
    {
      header: '',
      width: 56,
      render: (i) => <Avatar variant="rounded" src={resolveUploadUrl(i.image)} sx={{ width: 40, height: 40 }} />,
    },
    { header: 'Title', render: (i) => <Typography fontWeight={600}>{i.title || 'Untitled'}</Typography> },
    { header: 'Caption', render: (i) => i.caption || '—' },
  ];

  return (
    <>
      <AdminPageHeader
        title="Gallery"
        description="Manage photos shown on the public Gallery page."
        action={
          <Button variant="contained" startIcon={<LuPlus size={16} />} onClick={openCreate}>
            Add image
          </Button>
        }
      />

      <AdminDataTable columns={columns} rows={items || []} isLoading={isLoading} onEdit={openEdit} onDelete={onDelete} />

      <AdminFormDialog
        open={dialogOpen}
        title={editing ? 'Edit image' : 'Add image'}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit(onSubmit)}
        isSaving={updateMutation.isPending || isCreating}
      >
        <TextField label="Title (optional)" fullWidth {...register('title')} />
        <TextField label="Caption (optional)" fullWidth {...register('caption')} />
        <Controller
          name="displayOrder"
          control={control}
          render={({ field }) => (
            <TextField label="Display order" type="number" fullWidth value={field.value} onChange={(e) => field.onChange(Number(e.target.value))} />
          )}
        />

        {editing ? (
          <ImageUploadField label="Image" currentImageUrl={resolveUploadUrl(editing.image)} onUpload={async () => {}} disabled helperText="To replace this photo, delete it and add a new one." />
        ) : (
          <ImageUploadField
            label="Image (required)"
            currentImageUrl={pendingPreview}
            onUpload={handlePendingFileSelect}
            helperText="This image uploads together with the form when you click Save."
          />
        )}
      </AdminFormDialog>
    </>
  );
}
