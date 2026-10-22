'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, Stack, TextField, Button, Typography, CircularProgress } from '@mui/material';
import { LuKeyRound } from 'react-icons/lu';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import { adminAuthApi } from '@/lib/adminApi';
import { toastSuccess, toastError, extractErrorMessage } from '@/lib/adminAlerts';

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(6, 'Current password is required'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });
type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

export default function ChangePasswordPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordInput>({ resolver: zodResolver(changePasswordSchema) });

  const onSubmit = async (values: ChangePasswordInput) => {
    try {
      await adminAuthApi.changePassword(values.currentPassword, values.newPassword);
      toastSuccess('Password changed successfully');
      reset();
    } catch (err) {
      toastError(extractErrorMessage(err, 'Failed to change password'));
    }
  };

  return (
    <>
      <AdminPageHeader title="Change password" description="Update the password for your admin account." />

      <Card variant="outlined" sx={{ maxWidth: 480 }}>
        <CardContent sx={{ p: 3.5 }}>
          <Stack spacing={2.5} component="form" onSubmit={handleSubmit(onSubmit)}>
            <TextField
              label="Current password"
              type="password"
              fullWidth
              {...register('currentPassword')}
              error={!!errors.currentPassword}
              helperText={errors.currentPassword?.message}
            />
            <TextField
              label="New password"
              type="password"
              fullWidth
              {...register('newPassword')}
              error={!!errors.newPassword}
              helperText={errors.newPassword?.message}
            />
            <TextField
              label="Confirm new password"
              type="password"
              fullWidth
              {...register('confirmPassword')}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
            />
            <Typography variant="caption" color="text.secondary">
              You'll need to sign in again on other devices after changing your password.
            </Typography>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : <LuKeyRound size={16} />}
              sx={{ alignSelf: 'flex-start' }}
            >
              {isSubmitting ? 'Updating…' : 'Update password'}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </>
  );
}
