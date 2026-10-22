'use client';

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Button,
  TextField,
  Stack,
  Grid,
  FormControlLabel,
  Switch,
  Card,
  CardContent,
  Typography,
  Skeleton,
} from '@mui/material';
import { LuSave } from 'react-icons/lu';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import ImageUploadField from '@/components/admin/ImageUploadField';
import TagInput from '@/components/admin/TagInput';
import { toastSuccess, toastError, extractErrorMessage } from '@/lib/adminAlerts';
import { api } from '@/lib/axios';
import { uploadFile } from '@/lib/adminApi';
import { resolveUploadUrl } from '@/lib/axios';
import { About } from '@/types';

const aboutSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').max(150),
  tagline: z.string().max(200).optional(),
  roles: z.array(z.string()).default([]),
  biography: z.string().optional(),
  careerObjective: z.string().optional(),
  location: z.string().max(150).optional(),
  email: z.string().email('Enter a valid email').optional().or(z.literal('')),
  phone: z.string().max(50).optional(),
  availableForWork: z.boolean().default(true),
  currentStatus: z.string().max(100).optional(),
  languages: z.array(z.string()).default([]),
  interests: z.array(z.string()).default([]),
});
type AboutFormInput = z.infer<typeof aboutSchema>;

export default function AboutAdminPage() {
  const queryClient = useQueryClient();
  const { data: about, isLoading } = useQuery({
    queryKey: ['admin-about'],
    queryFn: () => api.get('/about').then((r) => r.data.data as About),
  });

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<AboutFormInput>({
    resolver: zodResolver(aboutSchema),
    defaultValues: {
      fullName: '',
      tagline: '',
      roles: [],
      biography: '',
      careerObjective: '',
      location: '',
      email: '',
      phone: '',
      availableForWork: true,
      currentStatus: '',
      languages: [],
      interests: [],
    },
  });

  useEffect(() => {
    if (about) {
      reset({
        fullName: about.fullName,
        tagline: about.tagline,
        roles: about.roles,
        biography: about.biography,
        careerObjective: about.careerObjective,
        location: about.location || '',
        email: about.email || '',
        phone: about.phone || '',
        availableForWork: about.availableForWork,
        currentStatus: about.currentStatus,
        languages: about.languages,
        interests: about.interests,
      });
    }
  }, [about, reset]);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-about'] });
    queryClient.invalidateQueries({ queryKey: ['about'] });
  };

  const updateMutation = useMutation({
    mutationFn: (payload: AboutFormInput) => api.put('/about', payload).then((r) => r.data.data as About),
    onSuccess: () => {
      invalidate();
      toastSuccess('About section updated');
    },
    onError: (err) => toastError(extractErrorMessage(err, 'Failed to update')),
  });

  const onSubmit = (values: AboutFormInput) => updateMutation.mutate(values);

  const handlePhotoUpload = async (file: File) => {
    try {
      await uploadFile('/about/photo', 'post', 'photo', file);
      invalidate();
      toastSuccess('Profile photo updated');
    } catch (err) {
      toastError(extractErrorMessage(err, 'Failed to upload photo'));
    }
  };

  const handleBannerUpload = async (file: File) => {
    try {
      await uploadFile('/about/banner', 'post', 'banner', file);
      invalidate();
      toastSuccess('Banner updated');
    } catch (err) {
      toastError(extractErrorMessage(err, 'Failed to upload banner'));
    }
  };

  if (isLoading) {
    return <Skeleton variant="rounded" height={480} />;
  }

  return (
    <>
      <AdminPageHeader title="About" description="This content powers your public Home and About pages." />

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card variant="outlined">
            <CardContent sx={{ p: 3 }}>
              <Stack spacing={3}>
                <ImageUploadField label="Profile photo" aspectRatio="1/1" currentImageUrl={about?.profilePhoto ? resolveUploadUrl(about.profilePhoto) : null} onUpload={handlePhotoUpload} />
                <ImageUploadField label="Banner image" aspectRatio="16/9" currentImageUrl={about?.bannerImage ? resolveUploadUrl(about.bannerImage) : null} onUpload={handleBannerUpload} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card variant="outlined">
            <CardContent sx={{ p: 3.5 }}>
              <Stack spacing={2.5} component="form" onSubmit={handleSubmit(onSubmit)}>
                <TextField label="Full name" fullWidth {...register('fullName')} error={!!errors.fullName} helperText={errors.fullName?.message} />
                <TextField label="Tagline" fullWidth {...register('tagline')} />

                <Controller
                  name="roles"
                  control={control}
                  render={({ field }) => <TagInput label="Roles (typing animation)" value={field.value} onChange={field.onChange} placeholder="e.g. Data Analyst" />}
                />

                <TextField label="Biography" fullWidth multiline minRows={4} {...register('biography')} />
                <TextField label="Career objective" fullWidth multiline minRows={3} {...register('careerObjective')} />

                <Stack direction="row" spacing={2}>
                  <TextField label="Location" fullWidth {...register('location')} />
                  <TextField label="Email" fullWidth {...register('email')} error={!!errors.email} helperText={errors.email?.message} />
                </Stack>
                <Stack direction="row" spacing={2}>
                  <TextField label="Phone" fullWidth {...register('phone')} />
                  <TextField label="Current status" fullWidth {...register('currentStatus')} />
                </Stack>

                <Controller
                  name="availableForWork"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel control={<Switch checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />} label="Available for work" />
                  )}
                />

                <Controller name="languages" control={control} render={({ field }) => <TagInput label="Languages" value={field.value} onChange={field.onChange} />} />
                <Controller name="interests" control={control} render={({ field }) => <TagInput label="Interests" value={field.value} onChange={field.onChange} />} />

                <Typography variant="caption" color="text.secondary">
                  Last updated: {about?.updatedAt ? new Date(about.updatedAt).toLocaleString() : '—'}
                </Typography>

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  sx={{ alignSelf: 'flex-start' }}
                  disabled={updateMutation.isPending}
                  startIcon={<LuSave size={16} />}
                >
                  {updateMutation.isPending ? 'Saving…' : 'Save changes'}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}
