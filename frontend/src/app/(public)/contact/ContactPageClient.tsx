'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Grid, TextField, Button, Stack, Typography, Box, CircularProgress } from '@mui/material';
import { LuSend, LuMail, LuMapPin, LuPhone } from 'react-icons/lu';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import Section from '@/components/shared/Section';
import PageHeader from '@/components/shared/PageHeader';
import Reveal from '@/components/shared/Reveal';
import { contactFormSchema, ContactFormInput } from '@/lib/validations/contact';
import { messagesApi } from '@/lib/api';
import { useAbout } from '@/hooks/usePublicData';

const MySwal = withReactContent(Swal);

export default function ContactPageClient() {
  const { data: about } = useAbout();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormInput>({ resolver: zodResolver(contactFormSchema) });

  const onSubmit = async (values: ContactFormInput) => {
    try {
      await messagesApi.create(values);
      reset();
      MySwal.fire({
        icon: 'success',
        title: 'Message sent!',
        text: "Thanks for reaching out — I'll get back to you soon.",
        confirmButtonColor: '#2DD4BF',
      });
    } catch (err) {
      MySwal.fire({
        icon: 'error',
        title: 'Something went wrong',
        text: 'Please try again in a moment, or email me directly.',
        confirmButtonColor: '#F87171',
      });
    }
  };

  return (
    <>
      <PageHeader eyebrow="> ./contact --send" title="Get in touch" description="Have a project, a question, or just want to say hi? Send a message below." />
      <Section>
        <Grid container spacing={6}>
          <Grid item xs={12} md={5}>
            <Reveal>
              <Stack spacing={3}>
                {about?.email && (
                  <Stack direction="row" spacing={2} alignItems="flex-start">
                    <LuMail size={20} style={{ marginTop: 2 }} />
                    <Box>
                      <Typography variant="subtitle2" fontWeight={700}>Email</Typography>
                      <Typography variant="body2" component="a" href={`mailto:${about.email}`} color="text.secondary">
                        {about.email}
                      </Typography>
                    </Box>
                  </Stack>
                )}
                {about?.phone && (
                  <Stack direction="row" spacing={2} alignItems="flex-start">
                    <LuPhone size={20} style={{ marginTop: 2 }} />
                    <Box>
                      <Typography variant="subtitle2" fontWeight={700}>Phone</Typography>
                      <Typography variant="body2" color="text.secondary">{about.phone}</Typography>
                    </Box>
                  </Stack>
                )}
                {about?.location && (
                  <Stack direction="row" spacing={2} alignItems="flex-start">
                    <LuMapPin size={20} style={{ marginTop: 2 }} />
                    <Box>
                      <Typography variant="subtitle2" fontWeight={700}>Location</Typography>
                      <Typography variant="body2" color="text.secondary">{about.location}</Typography>
                    </Box>
                  </Stack>
                )}
              </Stack>
            </Reveal>
          </Grid>

          <Grid item xs={12} md={7}>
            <Reveal delay={0.1}>
              <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                <Stack spacing={2.5}>
                  <TextField
                    label="Your name"
                    fullWidth
                    {...register('name')}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                  <TextField
                    label="Email address"
                    type="email"
                    fullWidth
                    {...register('email')}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                  <TextField
                    label="Subject (optional)"
                    fullWidth
                    {...register('subject')}
                    error={!!errors.subject}
                    helperText={errors.subject?.message}
                  />
                  <TextField
                    label="Message"
                    fullWidth
                    multiline
                    minRows={5}
                    {...register('message')}
                    error={!!errors.message}
                    helperText={errors.message?.message}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={isSubmitting}
                    endIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : <LuSend size={16} />}
                    sx={{ alignSelf: 'flex-start' }}
                  >
                    {isSubmitting ? 'Sending…' : 'Send message'}
                  </Button>
                </Stack>
              </Box>
            </Reveal>
          </Grid>
        </Grid>
      </Section>
    </>
  );
}
