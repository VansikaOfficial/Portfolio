'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Grid, Card, CardContent, Typography, Stack, Chip, Box } from '@mui/material';
import { LuArrowUpRight, LuCalendar } from 'react-icons/lu';
import Section from '@/components/shared/Section';
import PageHeader from '@/components/shared/PageHeader';
import EmptyState from '@/components/shared/EmptyState';
import CardGridSkeleton from '@/components/shared/CardGridSkeleton';
import Reveal from '@/components/shared/Reveal';
import { useBlogs } from '@/hooks/usePublicData';
import { resolveUploadUrl } from '@/lib/axios';

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export default function BlogsPageClient() {
  const { data: blogs, isLoading } = useBlogs();
  const list = (blogs || []).filter((b) => b.published);

  return (
    <>
      <PageHeader
        eyebrow="> tail -f blog.md"
        title="Blog"
        description="Notes on data, machine learning, and things I'm learning along the way."
      />
      <Section>
        {isLoading ? (
          <CardGridSkeleton count={4} />
        ) : list.length === 0 ? (
          <EmptyState title="No posts yet" description="New articles will show up here." />
        ) : (
          <Grid container spacing={3}>
            {list.map((blog, i) => (
              <Grid item xs={12} sm={6} key={blog.id}>
                <Reveal delay={(i % 2) * 0.08}>
                  <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column', '&:hover': { borderColor: 'primary.main' } }}>
                    <Box component={Link} href={`/blogs/${blog.slug}`} sx={{ position: 'relative', aspectRatio: '16/9', bgcolor: 'action.hover', display: 'block' }}>
                      {blog.coverImage ? (
                        <Image src={resolveUploadUrl(blog.coverImage)} alt={blog.title} fill style={{ objectFit: 'cover' }} loading="lazy" />
                      ) : (
                        <Box sx={{ display: 'grid', placeItems: 'center', height: '100%', color: 'text.disabled' }}>
                          <Typography className="mono" variant="caption">no cover</Typography>
                        </Box>
                      )}
                    </Box>
                    <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 1 }}>
                        <LuCalendar size={13} />
                        <Typography variant="caption" className="mono" color="text.secondary">
                          {formatDate(blog.createdAt)}
                        </Typography>
                      </Stack>
                      <Typography component={Link} href={`/blogs/${blog.slug}`} variant="h6" sx={{ mb: 1, '&:hover': { color: 'primary.main' } }}>
                        {blog.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flex: 1 }}>
                        {blog.excerpt}
                      </Typography>
                      <Stack direction="row" spacing={0.75} sx={{ flexWrap: 'wrap', gap: 0.75, mb: 1.5 }}>
                        {blog.tags.slice(0, 3).map((tag) => (
                          <Chip key={tag} label={tag} size="small" variant="outlined" />
                        ))}
                      </Stack>
                      <Typography component={Link} href={`/blogs/${blog.slug}`} variant="caption" className="mono" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.4, color: 'primary.main' }}>
                        read more <LuArrowUpRight size={12} />
                      </Typography>
                    </CardContent>
                  </Card>
                </Reveal>
              </Grid>
            ))}
          </Grid>
        )}
      </Section>
    </>
  );
}
