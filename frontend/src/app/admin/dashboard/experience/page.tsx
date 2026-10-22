'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, TextField, Typography, Stack, FormControlLabel, Switch } from '@mui/material';
import { LuPlus } from 'react-icons/lu';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminDataTable, { AdminColumn } from '@/components/admin/AdminDataTable';
import AdminFormDialog from '@/components/admin/AdminFormDialog';
import TagInput from '@/components/admin/TagInput';
import { useCrudResource } from '@/hooks/useCrudResource';
import { confirmDelete } from '@/lib/adminAlerts';
import { Experience } from '@/types';

const experienceSchema = z.object({
  company: z.string().min(1, 'Company is required').max(200),
  role: z.string().min(1, 'Role is required').max(150),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  isCurrent: z.boolean().default(false),
  location: z.string().max(150).optional(),
  responsibilities: z.array(z.string()).default([]),
  skillsUsed: z.array(z.string()).default([]),
  displayOrder: z.number().int().default(0),
});
type ExperienceFormInput = z.infer<typeof experienceSchema>;

const defaultValues: ExperienceFormInput = {
  company: '',
  role: '',
  startDate: '',
  endDate: '',
  isCurrent: false,
  location: '',
  responsibilities: [],
  skillsUsed: [],
  displayOrder: 0,
};

const formatDate = (iso: string) => new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

export default function ExperienceAdminPage() {
  const { items, isLoading, create, update, remove, isSaving } = useCrudResource<Experience>('experience', 'admin-experience');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Experience | null>(null);

  const { register, handleSubmit, control, reset, watch, formState: { errors } } = useForm<ExperienceFormInput>({
    resolver: zodResolver(experienceSchema),
    defaultValues,
  });
  const isCurrent = watch('isCurrent');

  const openCreate = () => {
    setEditing(null);
    reset(defaultValues);
    setDialogOpen(true);
  };

  const openEdit = (exp: Experience) => {
    setEditing(exp);
    reset({
      company: exp.company,
      role: exp.role,
      startDate: exp.startDate?.slice(0, 10),
      endDate: exp.endDate?.slice(0, 10) || '',
      isCurrent: exp.isCurrent,
      location: exp.location || '',
      responsibilities: exp.responsibilities,
      skillsUsed: exp.skillsUsed,
      displayOrder: exp.displayOrder,
    });
    setDialogOpen(true);
  };

  const onSubmit = async (values: ExperienceFormInput) => {
    const payload = { ...values, endDate: values.isCurrent ? null : values.endDate || null };
    if (editing) {
      await update({ id: editing.id, payload });
    } else {
      await create(payload);
    }
    setDialogOpen(false);
  };

  const onDelete = async (exp: Experience) => {
    if (await confirmDelete(`"${exp.role} at ${exp.company}"`)) {
      await remove(exp.id);
    }
  };

  const columns: AdminColumn<Experience>[] = [
    { header: 'Role', render: (e) => <Typography fontWeight={600}>{e.role}</Typography> },
    { header: 'Company', render: (e) => e.company },
    { header: 'Period', render: (e) => `${formatDate(e.startDate)} — ${e.isCurrent ? 'Present' : e.endDate ? formatDate(e.endDate) : ''}` },
  ];

  return (
    <>
      <AdminPageHeader
        title="Experience"
        description="Manage your professional work history."
        action={
          <Button variant="contained" startIcon={<LuPlus size={16} />} onClick={openCreate}>
            Add experience
          </Button>
        }
      />

      <AdminDataTable columns={columns} rows={items} isLoading={isLoading} onEdit={openEdit} onDelete={onDelete} />

      <AdminFormDialog
        open={dialogOpen}
        title={editing ? 'Edit experience' : 'Add experience'}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit(onSubmit)}
        isSaving={isSaving}
      >
        <TextField label="Company" fullWidth {...register('company')} error={!!errors.company} helperText={errors.company?.message} />
        <TextField label="Role" fullWidth {...register('role')} error={!!errors.role} helperText={errors.role?.message} />
        <TextField label="Location" fullWidth {...register('location')} />
        <Stack direction="row" spacing={2}>
          <TextField
            label="Start date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            {...register('startDate')}
            error={!!errors.startDate}
            helperText={errors.startDate?.message}
          />
          <TextField
            label="End date"
            type="date"
            fullWidth
            disabled={isCurrent}
            InputLabelProps={{ shrink: true }}
            {...register('endDate')}
          />
        </Stack>
        <Controller
          name="isCurrent"
          control={control}
          render={({ field }) => (
            <FormControlLabel control={<Switch checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />} label="Current role" />
          )}
        />
        <Controller
          name="responsibilities"
          control={control}
          render={({ field }) => <TagInput label="Responsibilities" value={field.value} onChange={field.onChange} />}
        />
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
      </AdminFormDialog>
    </>
  );
}
