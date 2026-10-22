'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Button,
  TextField,
  MenuItem,
  Stack,
  Slider,
  Typography,
  Chip,
} from '@mui/material';
import { LuPlus } from 'react-icons/lu';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminDataTable, { AdminColumn } from '@/components/admin/AdminDataTable';
import AdminFormDialog from '@/components/admin/AdminFormDialog';
import { useCrudResource } from '@/hooks/useCrudResource';
import { confirmDelete } from '@/lib/adminAlerts';
import { Skill, SkillCategory } from '@/types';

const CATEGORIES: SkillCategory[] = [
  'Programming',
  'Databases',
  'Machine Learning',
  'Deep Learning',
  'Visualization',
  'Cloud',
  'Tools',
  'Frameworks',
  'Soft Skills',
];

const skillSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  percentage: z.number().min(0).max(100),
  level: z.string().max(50).optional(),
  category: z.enum(CATEGORIES as [SkillCategory, ...SkillCategory[]]),
  icon: z.string().max(100).optional(),
  color: z.string().max(20).optional(),
  displayOrder: z.number().int().default(0),
});
type SkillFormInput = z.infer<typeof skillSchema>;

const defaultValues: SkillFormInput = {
  name: '',
  percentage: 50,
  level: '',
  category: 'Tools',
  icon: '',
  color: '#2DD4BF',
  displayOrder: 0,
};

export default function SkillsAdminPage() {
  const { items, isLoading, create, update, remove, isSaving } = useCrudResource<Skill>('skills', 'admin-skills');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Skill | null>(null);

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<SkillFormInput>({
    resolver: zodResolver(skillSchema),
    defaultValues,
  });

  const openCreate = () => {
    setEditing(null);
    reset(defaultValues);
    setDialogOpen(true);
  };

  const openEdit = (skill: Skill) => {
    setEditing(skill);
    reset({
      name: skill.name,
      percentage: skill.percentage,
      level: skill.level || '',
      category: skill.category,
      icon: skill.icon || '',
      color: skill.color || '#2DD4BF',
      displayOrder: skill.displayOrder,
    });
    setDialogOpen(true);
  };

  const onSubmit = async (values: SkillFormInput) => {
    if (editing) {
      await update({ id: editing.id, payload: values });
    } else {
      await create(values);
    }
    setDialogOpen(false);
  };

  const onDelete = async (skill: Skill) => {
    if (await confirmDelete(`"${skill.name}"`)) {
      await remove(skill.id);
    }
  };

  const columns: AdminColumn<Skill>[] = [
    { header: 'Name', render: (s) => <Typography fontWeight={600}>{s.name}</Typography> },
    { header: 'Category', render: (s) => <Chip size="small" label={s.category} variant="outlined" /> },
    { header: 'Level', render: (s) => s.level || '—' },
    { header: 'Proficiency', render: (s) => `${s.percentage}%` },
  ];

  return (
    <>
      <AdminPageHeader
        title="Skills"
        description="Manage the skills shown on your public Skills page."
        action={
          <Button variant="contained" startIcon={<LuPlus size={16} />} onClick={openCreate}>
            Add skill
          </Button>
        }
      />

      <AdminDataTable columns={columns} rows={items} isLoading={isLoading} onEdit={openEdit} onDelete={onDelete} />

      <AdminFormDialog
        open={dialogOpen}
        title={editing ? 'Edit skill' : 'Add skill'}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit(onSubmit)}
        isSaving={isSaving}
      >
        <TextField label="Skill name" fullWidth {...register('name')} error={!!errors.name} helperText={errors.name?.message} />

        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <TextField select label="Category" fullWidth {...field}>
              {CATEGORIES.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </TextField>
          )}
        />

        <TextField label="Level (e.g. Advanced)" fullWidth {...register('level')} />

        <Stack>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Proficiency
          </Typography>
          <Controller
            name="percentage"
            control={control}
            render={({ field }) => (
              <Slider {...field} valueLabelDisplay="auto" min={0} max={100} onChange={(_, v) => field.onChange(v)} />
            )}
          />
        </Stack>

        <Stack direction="row" spacing={2}>
          <TextField label="Icon name (react-icons)" fullWidth {...register('icon')} helperText="e.g. SiPython" />
          <TextField label="Color (hex)" fullWidth {...register('color')} />
        </Stack>

        <Controller
          name="displayOrder"
          control={control}
          render={({ field }) => (
            <TextField
              label="Display order"
              type="number"
              fullWidth
              value={field.value}
              onChange={(e) => field.onChange(Number(e.target.value))}
            />
          )}
        />
      </AdminFormDialog>
    </>
  );
}
