'use client';

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, TextField, Stack, Grid, MenuItem, FormControlLabel, Switch, Card, CardContent, Divider, Typography, Skeleton } from '@mui/material';
import { LuSave } from 'react-icons/lu';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import ImageUploadField from '@/components/admin/ImageUploadField';
import TagInput from '@/components/admin/TagInput';
import { toastSuccess, toastError, extractErrorMessage } from '@/lib/adminAlerts';
import { api, resolveUploadUrl } from '@/lib/axios';
import { uploadFile } from '@/lib/adminApi';
import { Setting } from '@/types';

const settingSchema = z.object({
  siteTitle: z.string().min(1, 'Site title is required').max(150),
  siteDescription: z.string().max(300).optional(),
  defaultTheme: z.enum(['light', 'dark', 'system']),
  primaryColor: z.string().max(20).optional(),
  metaTitle: z.string().max(200).optional(),
  metaDescription: z.string().max(300).optional(),
  metaKeywords: z.array(z.string()).default([]),
  googleAnalyticsId: z.string().optional(),
  maintenanceMode: z.boolean().default(false),
});
type SettingFormInput = z.infer<typeof settingSchema>;

export default function SettingsAdminPage() {
  const queryClient = useQueryClient();
  const { data: settings, isLoading } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: () => api.get('/settings').then((r) => r.data.data as Setting),
  });

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<SettingFormInput>({
    resolver: zodResolver(settingSchema),
    defaultValues: {
      siteTitle: '',
      siteDescription: '',
      defaultTheme: 'system',
      primaryColor: '',
      metaTitle: '',
      metaDescription: '',
      metaKeywords: [],
      googleAnalyticsId: '',
      maintenanceMode: false,
    },
  });

  useEffect(() => {
    if (settings) {
      reset({
        siteTitle: settings.siteTitle,
        siteDescription: settings.siteDescription || '',
        defaultTheme: (settings.defaultTheme as 'light' | 'dark' | 'system') || 'system',
        primaryColor: settings.primaryColor || '',
        metaTitle: settings.metaTitle || '',
        metaDescription: settings.metaDescription || '',
        metaKeywords: settings.metaKeywords,
        googleAnalyticsId: settings.googleAnalyticsId || '',
        maintenanceMode: settings.maintenanceMode,
      });
    }
  }, [settings, reset]);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
    queryClient.invalidateQueries({ queryKey: ['settings'] });
  };

  const updateMutation = useMutation({
    mutationFn: (payload: SettingFormInput) => api.put('/settings', payload).then((r) => r.data.data as Setting),
    onSuccess: () => {
      invalidate();
      toastSuccess('Settings updated');
    },
    onError: (err) => toastError(extractErrorMessage(err, 'Failed to update settings')),
  });

  const onSubmit = (values: SettingFormInput) => updateMutation.mutate(values);

  const handleFaviconUpload = async (file: File) => {
    try {
      await uploadFile('/settings/favicon', 'post', 'favicon', file);
      invalidate();
      toastSuccess('Favicon updated');
    } catch (err) {
      toastError(extractErrorMessage(err, 'Failed to upload favicon'));
    }
  };

  const handleOgImageUpload = async (file: File) => {
    try {
      await uploadFile('/settings/og-image', 'post', 'ogImage', file);
      invalidate();
      toastSuccess('OG image updated');
    } catch (err) {
      toastError(extractErrorMessage(err, 'Failed to upload OG image'));
    }
  };

  if (isLoading) return <Skeleton variant="rounded" height={480} />;

  return (
    <>
      <AdminPageHeader title="Settings & SEO" description="Site-wide settings, theme defaults, and search engine metadata." />

      <Card variant="outlined">
        <CardContent sx={{ p: 3.5 }}>
          <Stack spacing={2.5} component="form" onSubmit={handleSubmit(onSubmit)}>
            <Typography variant="overline" color="text.secondary">
              General
            </Typography>
            <TextField label="Site title" fullWidth {...register('siteTitle')} error={!!errors.siteTitle} helperText={errors.siteTitle?.message} />
            <TextField label="Site description" fullWidth multiline minRows={2} {...register('siteDescription')} />

            <Stack direction="row" spacing={2}>
              <Controller
                name="defaultTheme"
                control={control}
                render={({ field }) => (
                  <TextField select label="Default theme" fullWidth {...field}>
                    <MenuItem value="system">System</MenuItem>
                    <MenuItem value="light">Light</MenuItem>
                    <MenuItem value="dark">Dark</MenuItem>
                  </TextField>
                )}
              />
              <TextField label="Primary color (hex)" fullWidth {...register('primaryColor')} />
            </Stack>

            <Controller
              name="maintenanceMode"
              control={control}
              render={({ field }) => (
                <FormControlLabel control={<Switch checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />} label="Maintenance mode" />
              )}
            />

            <Divider sx={{ my: 1 }} />
            <Typography variant="overline" color="text.secondary">
              SEO
            </Typography>
            <TextField label="Meta title" fullWidth {...register('metaTitle')} />
            <TextField label="Meta description" fullWidth multiline minRows={2} {...register('metaDescription')} />
            <Controller name="metaKeywords" control={control} render={({ field }) => <TagInput label="Meta keywords" value={field.value} onChange={field.onChange} />} />
            <TextField label="Google Analytics ID" fullWidth {...register('googleAnalyticsId')} placeholder="G-XXXXXXXXXX" />

            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <ImageUploadField label="Favicon" aspectRatio="1/1" currentImageUrl={settings?.favicon ? resolveUploadUrl(settings.favicon) : null} onUpload={handleFaviconUpload} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <ImageUploadField label="Social share image (OG)" aspectRatio="16/9" currentImageUrl={settings?.ogImage ? resolveUploadUrl(settings.ogImage) : null} onUpload={handleOgImageUpload} />
              </Grid>
            </Grid>

            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{ alignSelf: 'flex-start', mt: 1 }}
              disabled={updateMutation.isPending}
              startIcon={<LuSave size={16} />}
            >
              {updateMutation.isPending ? 'Saving…' : 'Save settings'}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </>
  );
}
