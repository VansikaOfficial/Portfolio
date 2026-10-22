export interface NavItem {
  label: string;
  href: string;
}

export const primaryNav: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Skills', href: '/skills' },
  { label: 'Experience', href: '/experience' },
  { label: 'Projects', href: '/projects' },
  { label: 'Certificates', href: '/certificates' },
  { label: 'Blog', href: '/blogs' },
  { label: 'Contact', href: '/contact' },
];

export const footerNav: NavItem[] = [
  { label: 'Education', href: '/education' },
  { label: 'Internships', href: '/internships' },
  { label: 'Achievements', href: '/achievements' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Testimonials', href: '/testimonials' },
  { label: 'Services', href: '/services' },
  { label: 'Resume', href: '/resume' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
];
