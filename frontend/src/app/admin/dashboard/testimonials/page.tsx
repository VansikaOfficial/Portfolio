'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, TextField, Typography, Stack, Rating, FormControlLabel, Switch, Chip } from '@mui/material';
import { LuPlus } from 'react-icons/lu';
import { useQueryClient } from '@tanstack/react-query';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminDataTable, { AdminColumn } from '@/components/admin/AdminDataTable';
import AdminFormDialog from '@/components/admin/AdminFormDialog';
import ImageUploadField from '@/components/admin/ImageUploadField';
import { useCrudResource } from '@/hooks/useCrudResource';
import { confirmDelete, toastSuccess, toastError, extractErrorMessage } from '@/lib/adminAlerts';
import { uploadFile } from '@/lib/adminApi';
import { resolveUploadUrl } from '@/lib/axios';
import { Testimonial } from '@/types';

const testimonialSchema = z.object({
  name: z.string().min(1, 'Name is required').max(150),
  designation: z.string().max(150).optional(),
  company: z.string().max(150).optional(),
  message: z.string().min(1, 'Message is required'),
  rating: z.number().min(1).max(5),
  isApproved: z.boolean().default(true),
  displayOrder: z.number().int().default(0),
});
type TestimonialFormInput = z.infer<typeof testimonialSchema>;

const defaultValues: TestimonialFormInput = {
  name: '',
  designation: '',
  company: '',
  message: '',
  rating: 5,
  isApproved: true,
  displayOrder: 0,
};

export default function TestimonialsAdminPage() {
  const { items, isLoading, create, update, remove, isSaving } = useCrudResource<Testimonial>('testimonials', 'admin-testimonials');
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<TestimonialFormInput>({
    resolver: zodResolver(testimonialSchema),
    defaultValues,
  });

  const openCreate = () => {
    setEditing(null);
    reset(defaultValues);
    setDialogOpen(true);
  };

  const openEdit = (t: Testimonial) => {
    setEditing(t);
    reset({
      name: t.name,
      designation: t.designation || '',
      company: t.company || '',
      message: t.message,
      rating: t.rating,
      isApproved: t.isApproved,
      displayOrder: 0,
    });
    setDialogOpen(true);
  };

  const onSubmit = async (values: TestimonialFormInput) => {
    if (editing) {
      await update({ id: editing.id, payload: values });
      setDialogOpen(false);
    } else {
      const created = await create(values);
      setEditing(created);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    if (!editing) return;
    try {
      const updated = await uploadFile<Testimonial>(`/testimonials/${editing.id}/avatar`, 'post', 'avatar', file);
      setEditing(updated);
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      toastSuccess('Avatar uploaded');
    } catch (err) {
      toastError(extractErrorMessage(err, 'Failed to upload avatar'));
    }
  };

  const onDelete = async (t: Testimonial) => {
    if (await confirmDelete(`the testimonial from "${t.name}"`)) {
      await remove(t.id);
    }
  };

  const columns: AdminColumn<Testimonial>[] = [
    { header: 'Name', render: (t) => <Typography fontWeight={600}>{t.name}</Typography> },
    { header: 'Company', render: (t) => [t.designation, t.company].filter(Boolean).join(' · ') || '—' },
    { header: 'Rating', render: (t) => <Rating value={t.rating} readOnly size="small" /> },
    { header: 'Status', render: (t) => <Chip size="small" label={t.isApproved ? 'Approved' : 'Hidden'} color={t.isApproved ? 'success' : 'default'} variant="outlined" /> },
  ];

  return (
    <>
      <AdminPageHeader
        title="Testimonials"
        description="Manage kind words from clients and collaborators."
        action={
          <Button variant="contained" startIcon={<LuPlus size={16} />} onClick={openCreate}>
            Add testimonial
          </Button>
        }
      />

      <AdminDataTable columns={columns} rows={items} isLoading={isLoading} onEdit={openEdit} onDelete={onDelete} />

      <AdminFormDialog
        open={dialogOpen}
        title={editing ? 'Edit testimonial' : 'Add testimonial'}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit(onSubmit)}
        isSaving={isSaving}
      >
        <TextField label="Name" fullWidth {...register('name')} error={!!errors.name} helperText={errors.name?.message} />
        <Stack direction="row" spacing={2}>
          <TextField label="Designation" fullWidth {...register('designation')} />
          <TextField label="Company" fullWidth {...register('company')} />
        </Stack>
        <TextField label="Message" fullWidth multiline minRows={3} {...register('message')} error={!!errors.message} helperText={errors.message?.message} />

        <Stack>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Rating
          </Typography>
          <Controller name="rating" control={control} render={({ field }) => <Rating {...field} onChange={(_, v) => field.onChange(v || 5)} />} />
        </Stack>

        <Controller
          name="isApproved"
          control={control}
          render={({ field }) => (
            <FormControlLabel control={<Switch checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />} label="Approved (visible on public site)" />
          )}
        />

        {editing && (
          <ImageUploadField
            label="Avatar"
            aspectRatio="1/1"
            currentImageUrl={editing.avatar ? resolveUploadUrl(editing.avatar) : null}
            onUpload={handleAvatarUpload}
            helperText="Save the testimonial first, then upload an avatar."
          />
        )}
      </AdminFormDialog>
    </>
  );
}
