'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Paper,
  Stack,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
} from '@mui/material';
import { LuLock, LuMail, LuEye, LuEyeOff, LuShieldCheck } from 'react-icons/lu';
import { useAuth } from '@/hooks/useAuth';
import { loginSchema, LoginInput } from '@/lib/validations/auth';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/admin/dashboard');
    }
  }, [isLoading, isAuthenticated, router]);

  const onSubmit = async (values: LoginInput) => {
    setServerError(null);
    try {
      await login(values.email, values.password);
      router.replace('/admin/dashboard');
    } catch (err: any) {
      setServerError(err?.response?.data?.message || 'Invalid email or password');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100dvh',
        display: 'grid',
        placeItems: 'center',
        px: 2,
        background:
          'radial-gradient(60% 50% at 20% 10%, rgba(45,212,191,0.10) 0%, rgba(45,212,191,0) 60%), radial-gradient(50% 40% at 90% 90%, rgba(245,165,36,0.08) 0%, rgba(245,165,36,0) 60%)',
      }}
    >
      <Paper
        variant="outlined"
        sx={{ width: '100%', maxWidth: 420, p: { xs: 3.5, sm: 5 }, borderRadius: 4 }}
      >
        <Stack alignItems="center" spacing={1.5} sx={{ mb: 4 }}>
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: '14px',
              display: 'grid',
              placeItems: 'center',
              background: 'linear-gradient(135deg, #2DD4BF, #F5A524)',
              color: '#04201C',
            }}
          >
            <LuShieldCheck size={26} />
          </Box>
          <Typography variant="h5" sx={{ fontFamily: 'var(--font-fraunces)' }}>
            Admin Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sign in to manage your portfolio
          </Typography>
        </Stack>

        {serverError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {serverError}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack spacing={2.5}>
            <TextField
              label="Email address"
              type="email"
              fullWidth
              autoFocus
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LuMail size={18} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LuLock size={18} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword((s) => !s)} edge="end" size="small" aria-label="Toggle password visibility">
                      {showPassword ? <LuEyeOff size={18} /> : <LuEye size={18} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : undefined}
            >
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}
