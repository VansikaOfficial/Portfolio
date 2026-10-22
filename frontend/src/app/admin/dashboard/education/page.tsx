'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, TextField, Typography, Stack } from '@mui/material';
import { LuPlus } from 'react-icons/lu';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminDataTable, { AdminColumn } from '@/components/admin/AdminDataTable';
import AdminFormDialog from '@/components/admin/AdminFormDialog';
import { useCrudResource } from '@/hooks/useCrudResource';
import { confirmDelete } from '@/lib/adminAlerts';
import { Education } from '@/types';

const educationSchema = z.object({
  institution: z.string().min(1, 'Institution is required').max(200),
  degree: z.string().min(1, 'Degree is required').max(100),
  fieldOfStudy: z.string().max(100).optional(),
  cgpa: z.string().max(20).optional(),
  percentage: z.string().max(20).optional(),
  startYear: z.string().min(1, 'Start year is required').max(50),
  endYear: z.string().max(50).optional(),
  description: z.string().optional(),
  displayOrder: z.number().int().default(0),
});
type EducationFormInput = z.infer<typeof educationSchema>;

const defaultValues: EducationFormInput = {
  institution: '',
  degree: '',
  fieldOfStudy: '',
  cgpa: '',
  percentage: '',
  startYear: '',
  endYear: '',
  description: '',
  displayOrder: 0,
};

export default function EducationAdminPage() {
  const { items, isLoading, create, update, remove, isSaving } = useCrudResource<Education>('education', 'admin-education');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Education | null>(null);

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<EducationFormInput>({
    resolver: zodResolver(educationSchema),
    defaultValues,
  });

  const openCreate = () => {
    setEditing(null);
    reset(defaultValues);
    setDialogOpen(true);
  };

  const openEdit = (edu: Education) => {
    setEditing(edu);
    reset({
      institution: edu.institution,
      degree: edu.degree,
      fieldOfStudy: edu.fieldOfStudy || '',
      cgpa: edu.cgpa || '',
      percentage: edu.percentage || '',
      startYear: edu.startYear,
      endYear: edu.endYear || '',
      description: edu.description || '',
      displayOrder: edu.displayOrder,
    });
    setDialogOpen(true);
  };

  const onSubmit = async (values: EducationFormInput) => {
    if (editing) {
      await update({ id: editing.id, payload: values });
    } else {
      await create(values);
    }
    setDialogOpen(false);
  };

  const onDelete = async (edu: Education) => {
    if (await confirmDelete(`"${edu.degree}"`)) {
      await remove(edu.id);
    }
  };

  const columns: AdminColumn<Education>[] = [
    { header: 'Degree', render: (e) => <Typography fontWeight={600}>{e.degree}</Typography> },
    { header: 'Institution', render: (e) => e.institution },
    { header: 'Years', render: (e) => `${e.startYear} — ${e.endYear || 'Present'}` },
  ];

  return (
    <>
      <AdminPageHeader
        title="Education"
        description="Manage your academic background."
        action={
          <Button variant="contained" startIcon={<LuPlus size={16} />} onClick={openCreate}>
            Add education
          </Button>
        }
      />

      <AdminDataTable columns={columns} rows={items} isLoading={isLoading} onEdit={openEdit} onDelete={onDelete} />

      <AdminFormDialog
        open={dialogOpen}
        title={editing ? 'Edit education' : 'Add education'}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit(onSubmit)}
        isSaving={isSaving}
      >
        <TextField label="Institution" fullWidth {...register('institution')} error={!!errors.institution} helperText={errors.institution?.message} />
        <TextField label="Degree" fullWidth {...register('degree')} error={!!errors.degree} helperText={errors.degree?.message} />
        <TextField label="Field of study" fullWidth {...register('fieldOfStudy')} />
        <Stack direction="row" spacing={2}>
          <TextField label="CGPA" fullWidth {...register('cgpa')} />
          <TextField label="Percentage" fullWidth {...register('percentage')} />
        </Stack>
        <Stack direction="row" spacing={2}>
          <TextField label="Start year" fullWidth {...register('startYear')} error={!!errors.startYear} helperText={errors.startYear?.message} />
          <TextField label="End year" fullWidth {...register('endYear')} placeholder="Leave blank if ongoing" />
        </Stack>
        <TextField label="Description" fullWidth multiline minRows={2} {...register('description')} />
        <Controller
          name="displayOrder"
          control={control}
          render={({ field }) => (
            <TextField label="Display order" type="number" fullWidth value={field.value} onChange={(e) => field.onChange(Number(e.target.value))} />
          )}
        />
      </AdminFormDialog>
    </>
  );
}
