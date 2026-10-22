'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, TextField, Typography, FormControlLabel, Switch, Chip } from '@mui/material';
import { LuPlus } from 'react-icons/lu';
import { useQueryClient } from '@tanstack/react-query';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminDataTable, { AdminColumn } from '@/components/admin/AdminDataTable';
import AdminFormDialog from '@/components/admin/AdminFormDialog';
import ImageUploadField from '@/components/admin/ImageUploadField';
import TagInput from '@/components/admin/TagInput';
import { useCrudResource } from '@/hooks/useCrudResource';
import { confirmDelete, toastSuccess, toastError, extractErrorMessage } from '@/lib/adminAlerts';
import { uploadFile } from '@/lib/adminApi';
import { resolveUploadUrl } from '@/lib/axios';
import { Blog } from '@/types';

const blogSchema = z.object({
  title: z.string().min(1, 'Title is required').max(250),
  excerpt: z.string().min(1, 'Excerpt is required'),
  content: z.string().min(1, 'Content is required'),
  tags: z.array(z.string()).default([]),
  published: z.boolean().default(false),
});
type BlogFormInput = z.infer<typeof blogSchema>;

const defaultValues: BlogFormInput = { title: '', excerpt: '', content: '', tags: [], published: false };

export default function BlogsAdminPage() {
  const { items, isLoading, create, update, remove, isSaving } = useCrudResource<Blog>('blogs', 'admin-blogs');
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Blog | null>(null);

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<BlogFormInput>({
    resolver: zodResolver(blogSchema),
    defaultValues,
  });

  const openCreate = () => {
    setEditing(null);
    reset(defaultValues);
    setDialogOpen(true);
  };

  const openEdit = (blog: Blog) => {
    setEditing(blog);
    reset({
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content,
      tags: blog.tags,
      published: blog.published,
    });
    setDialogOpen(true);
  };

  const onSubmit = async (values: BlogFormInput) => {
    if (editing) {
      const updated = await update({ id: editing.id, payload: values });
      setEditing(updated);
    } else {
      const created = await create(values);
      setEditing(created);
    }
  };

  const handleCoverUpload = async (file: File) => {
    if (!editing) return;
    try {
      const updated = await uploadFile<Blog>(`/blogs/${editing.id}/cover`, 'post', 'cover', file);
      setEditing(updated);
      queryClient.invalidateQueries({ queryKey: ['admin-blogs'] });
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      toastSuccess('Cover image updated');
    } catch (err) {
      toastError(extractErrorMessage(err, 'Failed to upload cover image'));
    }
  };

  const onDelete = async (blog: Blog) => {
    if (await confirmDelete(`"${blog.title}"`)) {
      await remove(blog.id);
    }
  };

  const columns: AdminColumn<Blog>[] = [
    { header: 'Title', render: (b) => <Typography fontWeight={600}>{b.title}</Typography> },
    { header: 'Status', render: (b) => <Chip size="small" label={b.published ? 'Published' : 'Draft'} color={b.published ? 'success' : 'default'} variant="outlined" /> },
  ];

  return (
    <>
      <AdminPageHeader
        title="Blog"
        description="Write and manage blog posts. Content supports Markdown."
        action={
          <Button variant="contained" startIcon={<LuPlus size={16} />} onClick={openCreate}>
            Write post
          </Button>
        }
      />

      <AdminDataTable columns={columns} rows={items} isLoading={isLoading} onEdit={openEdit} onDelete={onDelete} />

      <AdminFormDialog
        open={dialogOpen}
        title={editing ? 'Edit post' : 'Write post'}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit(onSubmit)}
        isSaving={isSaving}
        maxWidth="md"
      >
        <TextField label="Title" fullWidth {...register('title')} error={!!errors.title} helperText={errors.title?.message} />
        <TextField label="Excerpt" fullWidth multiline minRows={2} {...register('excerpt')} error={!!errors.excerpt} helperText={errors.excerpt?.message} />
        <TextField
          label="Content (Markdown supported)"
          fullWidth
          multiline
          minRows={10}
          {...register('content')}
          error={!!errors.content}
          helperText={errors.content?.message}
          sx={{ '& textarea': { fontFamily: 'var(--font-jetbrains-mono)', fontSize: '0.85rem' } }}
        />

        <Controller name="tags" control={control} render={({ field }) => <TagInput label="Tags" value={field.value} onChange={field.onChange} />} />

        <Controller
          name="published"
          control={control}
          render={({ field }) => (
            <FormControlLabel control={<Switch checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />} label="Published (visible on public site)" />
          )}
        />

        {editing ? (
          <ImageUploadField label="Cover image" currentImageUrl={editing.coverImage ? resolveUploadUrl(editing.coverImage) : null} onUpload={handleCoverUpload} aspectRatio="16/9" />
        ) : (
          <Typography variant="caption" color="text.secondary">
            Save the post first to unlock the cover image upload.
          </Typography>
        )}
      </AdminFormDialog>
    </>
  );
}
