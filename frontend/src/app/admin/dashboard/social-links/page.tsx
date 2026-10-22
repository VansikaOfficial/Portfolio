'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, TextField, Typography, FormControlLabel, Switch, Link as MuiLink } from '@mui/material';
import { LuPlus } from 'react-icons/lu';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminDataTable, { AdminColumn } from '@/components/admin/AdminDataTable';
import AdminFormDialog from '@/components/admin/AdminFormDialog';
import { useCrudResource } from '@/hooks/useCrudResource';
import { confirmDelete } from '@/lib/adminAlerts';
import { SocialLink } from '@/types';

const socialLinkSchema = z.object({
  platform: z.string().min(1, 'Platform is required').max(50),
  url: z.string().url('Enter a valid URL'),
  icon: z.string().max(100).optional(),
  isVisible: z.boolean().default(true),
  displayOrder: z.number().int().default(0),
});
type SocialLinkFormInput = z.infer<typeof socialLinkSchema>;

const defaultValues: SocialLinkFormInput = {
  platform: '',
  url: '',
  icon: '',
  isVisible: true,
  displayOrder: 0,
};

export default function SocialLinksAdminPage() {
  const { items, isLoading, create, update, remove, isSaving } = useCrudResource<SocialLink>('social-links', 'admin-social-links');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<SocialLink | null>(null);

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<SocialLinkFormInput>({
    resolver: zodResolver(socialLinkSchema),
    defaultValues,
  });

  const openCreate = () => {
    setEditing(null);
    reset(defaultValues);
    setDialogOpen(true);
  };

  const openEdit = (link: SocialLink) => {
    setEditing(link);
    reset({
      platform: link.platform,
      url: link.url,
      icon: link.icon || '',
      isVisible: link.isVisible,
      displayOrder: link.displayOrder,
    });
    setDialogOpen(true);
  };

  const onSubmit = async (values: SocialLinkFormInput) => {
    if (editing) {
      await update({ id: editing.id, payload: values });
    } else {
      await create(values);
    }
    setDialogOpen(false);
  };

  const onDelete = async (link: SocialLink) => {
    if (await confirmDelete(`the "${link.platform}" link`)) {
      await remove(link.id);
    }
  };

  const columns: AdminColumn<SocialLink>[] = [
    { header: 'Platform', render: (l) => <Typography fontWeight={600} sx={{ textTransform: 'capitalize' }}>{l.platform}</Typography> },
    {
      header: 'URL',
      render: (l) => (
        <MuiLink href={l.url} target="_blank" rel="noopener noreferrer" variant="body2">
          {l.url}
        </MuiLink>
      ),
    },
    { header: 'Visible', render: (l) => (l.isVisible ? 'Yes' : 'No') },
  ];

  return (
    <>
      <AdminPageHeader
        title="Social Links"
        description="Manage the social icons shown in your header and footer."
        action={
          <Button variant="contained" startIcon={<LuPlus size={16} />} onClick={openCreate}>
            Add link
          </Button>
        }
      />

      <AdminDataTable columns={columns} rows={items} isLoading={isLoading} onEdit={openEdit} onDelete={onDelete} />

      <AdminFormDialog
        open={dialogOpen}
        title={editing ? 'Edit social link' : 'Add social link'}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit(onSubmit)}
        isSaving={isSaving}
      >
        <TextField label="Platform" fullWidth placeholder="e.g. github, linkedin" {...register('platform')} error={!!errors.platform} helperText={errors.platform?.message} />
        <TextField label="URL" fullWidth {...register('url')} error={!!errors.url} helperText={errors.url?.message} />
        <TextField label="Icon name (react-icons)" fullWidth {...register('icon')} helperText="e.g. Github, Linkedin, Twitter (from react-icons/fa6)" />
        <Controller
          name="isVisible"
          control={control}
          render={({ field }) => (
            <FormControlLabel control={<Switch checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />} label="Visible on public site" />
          )}
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
