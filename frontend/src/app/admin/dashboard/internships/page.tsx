'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, TextField, Typography } from '@mui/material';
import { LuPlus } from 'react-icons/lu';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminDataTable, { AdminColumn } from '@/components/admin/AdminDataTable';
import AdminFormDialog from '@/components/admin/AdminFormDialog';
import TagInput from '@/components/admin/TagInput';
import ImageUploadField from '@/components/admin/ImageUploadField';
import { useCrudResource } from '@/hooks/useCrudResource';
import { confirmDelete, toastSuccess, toastError, extractErrorMessage } from '@/lib/adminAlerts';
import { uploadFile } from '@/lib/adminApi';
import { resolveUploadUrl } from '@/lib/axios';
import { useQueryClient } from '@tanstack/react-query';
import { Internship } from '@/types';

const internshipSchema = z.object({
  company: z.string().min(1, 'Company is required').max(200),
  role: z.string().min(1, 'Role is required').max(150),
  duration: z.string().min(1, 'Duration is required').max(100),
  description: z.string().optional(),
  skillsUsed: z.array(z.string()).default([]),
  displayOrder: z.number().int().default(0),
});
type InternshipFormInput = z.infer<typeof internshipSchema>;

const defaultValues: InternshipFormInput = {
  company: '',
  role: '',
  duration: '',
  description: '',
  skillsUsed: [],
  displayOrder: 0,
};

export default function InternshipsAdminPage() {
  const { items, isLoading, create, update, remove, isSaving } = useCrudResource<Internship>('internships', 'admin-internships');
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Internship | null>(null);

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<InternshipFormInput>({
    resolver: zodResolver(internshipSchema),
    defaultValues,
  });

  const openCreate = () => {
    setEditing(null);
    reset(defaultValues);
    setDialogOpen(true);
  };

  const openEdit = (item: Internship) => {
    setEditing(item);
    reset({
      company: item.company,
      role: item.role,
      duration: item.duration,
      description: item.description || '',
      skillsUsed: item.skillsUsed,
      displayOrder: item.displayOrder,
    });
    setDialogOpen(true);
  };

  const onSubmit = async (values: InternshipFormInput) => {
    if (editing) {
      await update({ id: editing.id, payload: values });
      setDialogOpen(false);
    } else {
      const created = await create(values);
      // keep dialog open, switch to edit mode so the certificate can be uploaded immediately
      setEditing(created);
    }
  };

  const handleCertificateUpload = async (file: File) => {
    if (!editing) return;
    try {
      const updated = await uploadFile<Internship>(`/internships/${editing.id}/certificate`, 'post', 'certificate', file);
      setEditing(updated);
      queryClient.invalidateQueries({ queryKey: ['admin-internships'] });
      queryClient.invalidateQueries({ queryKey: ['internships'] });
      toastSuccess('Certificate uploaded');
    } catch (err) {
      toastError(extractErrorMessage(err, 'Failed to upload certificate'));
    }
  };

  const onDelete = async (item: Internship) => {
    if (await confirmDelete(`"${item.role} at ${item.company}"`)) {
      await remove(item.id);
    }
  };

  const columns: AdminColumn<Internship>[] = [
    { header: 'Role', render: (i) => <Typography fontWeight={600}>{i.role}</Typography> },
    { header: 'Company', render: (i) => i.company },
    { header: 'Duration', render: (i) => i.duration },
  ];

  return (
    <>
      <AdminPageHeader
        title="Internships"
        description="Manage internship experience shown on the public site."
        action={
          <Button variant="contained" startIcon={<LuPlus size={16} />} onClick={openCreate}>
            Add internship
          </Button>
        }
      />

      <AdminDataTable columns={columns} rows={items} isLoading={isLoading} onEdit={openEdit} onDelete={onDelete} />

      <AdminFormDialog
        open={dialogOpen}
        title={editing ? 'Edit internship' : 'Add internship'}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit(onSubmit)}
        isSaving={isSaving}
      >
        <TextField label="Company" fullWidth {...register('company')} error={!!errors.company} helperText={errors.company?.message} />
        <TextField label="Role" fullWidth {...register('role')} error={!!errors.role} helperText={errors.role?.message} />
        <TextField label="Duration" fullWidth placeholder="e.g. Jun 2024 - Aug 2024" {...register('duration')} error={!!errors.duration} helperText={errors.duration?.message} />
        <TextField label="Description" fullWidth multiline minRows={2} {...register('description')} />
        <Controller
          name="skillsUsed"
          control={control}
          render={({ field }) => <TagInput label="Skills used" value={field.value} onChange={field.onChange} />}
        />
        <Controller
          name="displayOrder"
          control={control}
          render={({ field }) => (
            <TextField label="Display order" type="number" fullWidth value={field.value} onChange={(e) => field.onChange(Number(e.target.value))} />
          )}
        />

        {editing && (
          <ImageUploadField
            label="Certificate image"
            currentImageUrl={editing.certificateImage ? resolveUploadUrl(editing.certificateImage) : null}
            onUpload={handleCertificateUpload}
            helperText="Save the internship first, then upload its certificate."
          />
        )}
      </AdminFormDialog>
    </>
  );
}
