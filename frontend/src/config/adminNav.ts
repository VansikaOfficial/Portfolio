import {
  LuLayoutDashboard,
  LuUser,
  LuSparkles,
  LuFolderKanban,
  LuGraduationCap,
  LuBriefcase,
  LuBuilding2,
  LuAward,
  LuImage,
  LuMail,
  LuNotebookPen,
  LuQuote,
  LuSettings,
  LuLink,
  LuFileText,
} from 'react-icons/lu';
import type { IconType } from 'react-icons';

export interface AdminNavItem {
  label: string;
  href: string;
  icon: IconType;
}

export const adminNavGroups: { title: string; items: AdminNavItem[] }[] = [
  {
    title: 'Overview',
    items: [{ label: 'Dashboard', href: '/admin/dashboard', icon: LuLayoutDashboard }],
  },
  {
    title: 'Profile',
    items: [
      { label: 'About', href: '/admin/dashboard/about', icon: LuUser },
      { label: 'Resume', href: '/admin/dashboard/resume', icon: LuFileText },
      { label: 'Social Links', href: '/admin/dashboard/social-links', icon: LuLink },
    ],
  },
  {
    title: 'Content',
    items: [
      { label: 'Skills', href: '/admin/dashboard/skills', icon: LuSparkles },
      { label: 'Projects', href: '/admin/dashboard/projects', icon: LuFolderKanban },
      { label: 'Education', href: '/admin/dashboard/education', icon: LuGraduationCap },
      { label: 'Experience', href: '/admin/dashboard/experience', icon: LuBriefcase },
      { label: 'Internships', href: '/admin/dashboard/internships', icon: LuBuilding2 },
      { label: 'Certificates', href: '/admin/dashboard/certificates', icon: LuAward },
      { label: 'Gallery', href: '/admin/dashboard/gallery', icon: LuImage },
      { label: 'Blogs', href: '/admin/dashboard/blogs', icon: LuNotebookPen },
      { label: 'Testimonials', href: '/admin/dashboard/testimonials', icon: LuQuote },
    ],
  },
  {
    title: 'Inbox & Settings',
    items: [
      { label: 'Messages', href: '/admin/dashboard/messages', icon: LuMail },
      { label: 'Settings & SEO', href: '/admin/dashboard/settings', icon: LuSettings },
    ],
  },
];
