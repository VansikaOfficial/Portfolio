'use client';

import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { Container, Typography, Stack, Chip, Button, Box, Skeleton } from '@mui/material';
import { LuArrowLeft, LuCalendar } from 'react-icons/lu';
import Section from '@/components/shared/Section';
import Reveal from '@/components/shared/Reveal';
import { useBlogBySlug } from '@/hooks/usePublicData';
import { resolveUploadUrl } from '@/lib/axios';

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

export default function BlogDetailClient({ slug }: { slug: string }) {
  const { data: blog, isLoading, isError } = useBlogBySlug(slug);

  if (isError) notFound();

  return (
    <Section>
      <Container maxWidth="md" disableGutters>
        <Button component={Link} href="/blogs" startIcon={<LuArrowLeft size={16} />} sx={{ mb: 3 }} color="inherit">
          Back to blog
        </Button>

        {isLoading || !blog ? (
          <>
            <Skeleton variant="text" height={60} width="80%" />
            <Skeleton variant="rounded" height={320} sx={{ mt: 2, borderRadius: 3 }} />
          </>
        ) : (
          <Reveal>
            <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 2 }}>
              <LuCalendar size={14} />
              <Typography variant="caption" className="mono" color="text.secondary">
                {formatDate(blog.createdAt)}
              </Typography>
            </Stack>

            <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.75rem' }, mb: 2 }}>
              {blog.title}
            </Typography>

            <Stack direction="row" spacing={0.75} sx={{ mb: 4, flexWrap: 'wrap', gap: 0.75 }}>
              {blog.tags.map((tag) => (
                <Chip key={tag} label={tag} size="small" variant="outlined" />
              ))}
            </Stack>

            {blog.coverImage && (
              <Box sx={{ position: 'relative', width: '100%', aspectRatio: '16/9', borderRadius: 3, overflow: 'hidden', mb: 4 }}>
                <Image src={resolveUploadUrl(blog.coverImage)} alt={blog.title} fill style={{ objectFit: 'cover' }} priority />
              </Box>
            )}

            <Box
              sx={{
                '& h1, & h2, & h3': { fontFamily: 'var(--font-fraunces)', mt: 4, mb: 1.5 },
                '& p': { color: 'text.secondary', lineHeight: 1.9, mb: 2 },
                '& a': { color: 'primary.main', textDecoration: 'underline' },
                '& code': {
                  fontFamily: 'var(--font-jetbrains-mono)',
                  bgcolor: 'action.hover',
                  px: 0.6,
                  py: 0.2,
                  borderRadius: 1,
                  fontSize: '0.85em',
                },
                '& pre': {
                  bgcolor: 'action.hover',
                  p: 2,
                  borderRadius: 2,
                  overflowX: 'auto',
                  fontFamily: 'var(--font-jetbrains-mono)',
                },
                '& blockquote': {
                  borderLeft: '3px solid',
                  borderColor: 'primary.main',
                  pl: 2,
                  ml: 0,
                  color: 'text.secondary',
                  fontStyle: 'italic',
                },
                '& ul, & ol': { pl: 3, color: 'text.secondary', mb: 2 },
                '& img': { borderRadius: 2, my: 2 },
              }}
            >
              <ReactMarkdown>{blog.content}</ReactMarkdown>
            </Box>
          </Reveal>
        )}
      </Container>
    </Section>
  );
}
