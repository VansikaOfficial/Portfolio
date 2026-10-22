'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Grid, Typography, Card, CardContent, Stack, Button } from '@mui/material';
import {
  LuSparkles,
  LuFolderKanban,
  LuGraduationCap,
  LuBriefcase,
  LuBuilding2,
  LuAward,
  LuImage,
  LuNotebookPen,
  LuQuote,
  LuMail,
  LuArrowUpRight,
} from 'react-icons/lu';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import StatCard from '@/components/admin/StatCard';
import { useAuth } from '@/hooks/useAuth';
import {
  useSkills,
  useProjects,
  useEducation,
  useExperience,
  useInternships,
  useCertificates,
  useGallery,
  useBlogs,
  useTestimonials,
} from '@/hooks/usePublicData';
import { messagesAdminApi } from '@/lib/adminApi';

export default function AdminDashboardHome() {
  const { user } = useAuth();

  const { data: skills } = useSkills();
  const { data: projects } = useProjects();
  const { data: education } = useEducation();
  const { data: experience } = useExperience();
  const { data: internships } = useInternships();
  const { data: certificates } = useCertificates();
  const { data: gallery } = useGallery();
  const { data: blogs } = useBlogs();
  const { data: testimonials } = useTestimonials();
  const { data: unread } = useQuery({ queryKey: ['admin', 'messages', 'unread-count'], queryFn: messagesAdminApi.unreadCount });

  const stats = [
    { label: 'Skills', value: skills?.length ?? '—', icon: LuSparkles, href: '/admin/dashboard/skills' },
    { label: 'Projects', value: projects?.length ?? '—', icon: LuFolderKanban, href: '/admin/dashboard/projects' },
    { label: 'Education', value: education?.length ?? '—', icon: LuGraduationCap, href: '/admin/dashboard/education' },
    { label: 'Experience', value: experience?.length ?? '—', icon: LuBriefcase, href: '/admin/dashboard/experience' },
    { label: 'Internships', value: internships?.length ?? '—', icon: LuBuilding2, href: '/admin/dashboard/internships' },
    { label: 'Certificates', value: certificates?.length ?? '—', icon: LuAward, href: '/admin/dashboard/certificates' },
    { label: 'Gallery items', value: gallery?.length ?? '—', icon: LuImage, href: '/admin/dashboard/gallery' },
    { label: 'Blog posts', value: blogs?.length ?? '—', icon: LuNotebookPen, href: '/admin/dashboard/blogs' },
    { label: 'Testimonials', value: testimonials?.length ?? '—', icon: LuQuote, href: '/admin/dashboard/testimonials' },
    { label: 'Unread messages', value: unread?.count ?? '—', icon: LuMail, href: '/admin/dashboard/messages' },
  ];

  return (
    <>
      <AdminPageHeader title={`Welcome back, ${user?.name?.split(' ')[0] || 'Admin'}`} description="Here's a snapshot of your portfolio content." />

      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        {stats.map((s) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={s.label}>
            <Link href={s.href} style={{ textDecoration: 'none' }}>
              <StatCard label={s.label} value={s.value} icon={s.icon} />
            </Link>
          </Grid>
        ))}
      </Grid>

      <Card variant="outlined">
        <CardContent sx={{ p: 3.5 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Quick actions
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
            Jump straight into the most common tasks.
          </Typography>
          <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap', gap: 1.5 }}>
            <Button component={Link} href="/admin/dashboard/projects" variant="outlined" endIcon={<LuArrowUpRight size={15} />}>
              Add a project
            </Button>
            <Button component={Link} href="/admin/dashboard/blogs" variant="outlined" endIcon={<LuArrowUpRight size={15} />}>
              Write a blog post
            </Button>
            <Button component={Link} href="/admin/dashboard/about" variant="outlined" endIcon={<LuArrowUpRight size={15} />}>
              Update About section
            </Button>
            <Button component={Link} href="/admin/dashboard/messages" variant="outlined" endIcon={<LuArrowUpRight size={15} />}>
              Check messages
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </>
  );
}
