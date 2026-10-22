'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Button,
  TextField,
  Typography,
  Stack,
  MenuItem,
  FormControlLabel,
  Switch,
  Box,
  IconButton,
  Chip,
} from '@mui/material';
import { LuPlus, LuX, LuUpload } from 'react-icons/lu';
import { useQueryClient } from '@tanstack/react-query';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminDataTable, { AdminColumn } from '@/components/admin/AdminDataTable';
import AdminFormDialog from '@/components/admin/AdminFormDialog';
import ImageUploadField from '@/components/admin/ImageUploadField';
import TagInput from '@/components/admin/TagInput';
import { useCrudResource } from '@/hooks/useCrudResource';
import { confirmDelete, toastSuccess, toastError, extractErrorMessage } from '@/lib/adminAlerts';
import { uploadFile } from '@/lib/adminApi';
import { resolveUploadUrl, api } from '@/lib/axios';
import { Project, ProjectStatus } from '@/types';

const STATUS_OPTIONS: ProjectStatus[] = ['in_progress', 'completed', 'archived'];
const STATUS_LABEL: Record<ProjectStatus, string> = {
  in_progress: 'In progress',
  completed: 'Completed',
  archived: 'Archived',
};

const projectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().min(1, 'Description is required'),
  longDescription: z.string().optional(),
  techStack: z.array(z.string()).default([]),
  githubLink: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  liveDemoLink: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  status: z.enum(STATUS_OPTIONS as [ProjectStatus, ...ProjectStatus[]]),
  featured: z.boolean().default(false),
  displayOrder: z.number().int().default(0),
});
type ProjectFormInput = z.infer<typeof projectSchema>;

const defaultValues: ProjectFormInput = {
  title: '',
  description: '',
  longDescription: '',
  techStack: [],
  githubLink: '',
  liveDemoLink: '',
  status: 'completed',
  featured: false,
  displayOrder: 0,
};

export default function ProjectsAdminPage() {
  const { items, isLoading, create, update, remove, isSaving } = useCrudResource<Project>('projects', 'admin-projects');
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [uploadingImages, setUploadingImages] = useState(false);

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<ProjectFormInput>({
    resolver: zodResolver(projectSchema),
    defaultValues,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
    queryClient.invalidateQueries({ queryKey: ['projects'] });
  };

  const openCreate = () => {
    setEditing(null);
    reset(defaultValues);
    setDialogOpen(true);
  };

  const openEdit = (project: Project) => {
    setEditing(project);
    reset({
      title: project.title,
      description: project.description,
      longDescription: project.longDescription || '',
      techStack: project.techStack,
      githubLink: project.githubLink || '',
      liveDemoLink: project.liveDemoLink || '',
      status: project.status,
      featured: project.featured,
      displayOrder: project.displayOrder,
    });
    setDialogOpen(true);
  };

  const onSubmit = async (values: ProjectFormInput) => {
    if (editing) {
      const updated = await update({ id: editing.id, payload: values });
      setEditing(updated);
    } else {
      const created = await create(values);
      setEditing(created);
    }
  };

  const handleThumbnailUpload = async (file: File) => {
    if (!editing) return;
    try {
      const updated = await uploadFile<Project>(`/projects/${editing.id}/thumbnail`, 'post', 'thumbnail', file);
      setEditing(updated);
      invalidate();
      toastSuccess('Thumbnail updated');
    } catch (err) {
      toastError(extractErrorMessage(err, 'Failed to upload thumbnail'));
    }
  };

  const handleGalleryImagesUpload = async (fileList: FileList) => {
    if (!editing || fileList.length === 0) return;
    setUploadingImages(true);
    const formData = new FormData();
    Array.from(fileList).forEach((f) => formData.append('images', f));
    try {
      const res = await api.post(`/projects/${editing.id}/images`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setEditing(res.data.data);
      invalidate();
      toastSuccess('Images added');
    } catch (err) {
      toastError(extractErrorMessage(err, 'Failed to upload images'));
    } finally {
      setUploadingImages(false);
    }
  };

  const handleRemoveGalleryImage = async (imageUrl: string) => {
    if (!editing) return;
    try {
      const res = await api.delete(`/projects/${editing.id}/images`, { data: { imageUrl } });
      setEditing(res.data.data);
      invalidate();
      toastSuccess('Image removed');
    } catch (err) {
      toastError(extractErrorMessage(err, 'Failed to remove image'));
    }
  };

  const onDelete = async (project: Project) => {
    if (await confirmDelete(`"${project.title}"`)) {
      await remove(project.id);
    }
  };

  const columns: AdminColumn<Project>[] = [
    { header: 'Title', render: (p) => <Typography fontWeight={600}>{p.title}</Typography> },
    { header: 'Status', render: (p) => <Chip size="small" label={STATUS_LABEL[p.status]} variant="outlined" /> },
    { header: 'Featured', render: (p) => (p.featured ? 'Yes' : 'No') },
  ];

  return (
    <>
      <AdminPageHeader
        title="Projects"
        description="Manage the projects shown on your public Projects page."
        action={
          <Button variant="contained" startIcon={<LuPlus size={16} />} onClick={openCreate}>
            Add project
          </Button>
        }
      />

      <AdminDataTable columns={columns} rows={items} isLoading={isLoading} onEdit={openEdit} onDelete={onDelete} />

      <AdminFormDialog
        open={dialogOpen}
        title={editing ? 'Edit project' : 'Add project'}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit(onSubmit)}
        isSaving={isSaving}
        maxWidth="md"
      >
        <TextField label="Title" fullWidth {...register('title')} error={!!errors.title} helperText={errors.title?.message} />
        <TextField label="Short description" fullWidth multiline minRows={2} {...register('description')} error={!!errors.description} helperText={errors.description?.message} />
        <TextField label="Long description (optional)" fullWidth multiline minRows={4} {...register('longDescription')} />

        <Controller
          name="techStack"
          control={control}
          render={({ field }) => <TagInput label="Tech stack" value={field.value} onChange={field.onChange} placeholder="e.g. Python, React, PostgreSQL" />}
        />

        <Stack direction="row" spacing={2}>
          <TextField label="GitHub link" fullWidth {...register('githubLink')} error={!!errors.githubLink} helperText={errors.githubLink?.message} />
          <TextField label="Live demo link" fullWidth {...register('liveDemoLink')} error={!!errors.liveDemoLink} helperText={errors.liveDemoLink?.message} />
        </Stack>

        <Stack direction="row" spacing={2} alignItems="center">
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <TextField select label="Status" fullWidth {...field}>
                {STATUS_OPTIONS.map((s) => (
                  <MenuItem key={s} value={s}>
                    {STATUS_LABEL[s]}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <Controller
            name="featured"
            control={control}
            render={({ field }) => (
              <FormControlLabel control={<Switch checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />} label="Featured" sx={{ whiteSpace: 'nowrap' }} />
            )}
          />
        </Stack>

        <Controller
          name="displayOrder"
          control={control}
          render={({ field }) => (
            <TextField label="Display order" type="number" fullWidth value={field.value} onChange={(e) => field.onChange(Number(e.target.value))} />
          )}
        />

        {editing && (
          <>
            <ImageUploadField label="Thumbnail" currentImageUrl={editing.thumbnail ? resolveUploadUrl(editing.thumbnail) : null} onUpload={handleThumbnailUpload} aspectRatio="16/10" />

            <Box>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Gallery images
              </Typography>
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1, mb: 1.5 }}>
                {editing.images.map((img) => (
                  <Box key={img} sx={{ position: 'relative', width: 88, height: 66, borderRadius: 1.5, overflow: 'hidden' }}>
                    <Image src={resolveUploadUrl(img)} alt="Project image" fill style={{ objectFit: 'cover' }} />
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveGalleryImage(img)}
                      sx={{ position: 'absolute', top: 2, right: 2, bgcolor: 'rgba(0,0,0,0.5)', color: 'white', p: 0.3, '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' } }}
                    >
                      <LuX size={12} />
                    </IconButton>
                  </Box>
                ))}
              </Stack>
              <Button component="label" size="small" variant="outlined" startIcon={<LuUpload size={14} />} disabled={uploadingImages}>
                {uploadingImages ? 'Uploading…' : 'Add images'}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={(e) => e.target.files && handleGalleryImagesUpload(e.target.files)}
                />
              </Button>
            </Box>
          </>
        )}
        {!editing && (
          <Typography variant="caption" color="text.secondary">
            Save the project first to unlock thumbnail and gallery image uploads.
          </Typography>
        )}
      </AdminFormDialog>
    </>
  );
}
