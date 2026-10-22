import { Card, CardContent, Avatar, Typography, Stack } from '@mui/material';
import { LuStar, LuQuote } from 'react-icons/lu';
import { Testimonial } from '@/types';
import { resolveUploadUrl } from '@/lib/axios';

export default function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <Card variant="outlined" sx={{ height: '100%', p: 1 }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <LuQuote size={22} style={{ opacity: 0.35 }} />
        <Typography variant="body1" sx={{ mt: 2, mb: 3, flex: 1, fontStyle: 'italic' }}>
          &ldquo;{testimonial.message}&rdquo;
        </Typography>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar src={testimonial.avatar ? resolveUploadUrl(testimonial.avatar) : undefined}>
            {testimonial.name[0]}
          </Avatar>
          <Stack spacing={0.2}>
            <Typography variant="subtitle2" fontWeight={700}>
              {testimonial.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {[testimonial.designation, testimonial.company].filter(Boolean).join(' · ')}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={0.25} sx={{ ml: 'auto' }}>
            {Array.from({ length: testimonial.rating }).map((_, i) => (
              <LuStar key={i} size={13} fill="currentColor" style={{ color: '#F5A524' }} />
            ))}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
