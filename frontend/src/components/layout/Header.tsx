'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  AppBar,
  Toolbar,
  Container,
  Box,
  Stack,
  Button,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Divider,
} from '@mui/material';
import { LuMenu, LuX, LuArrowUpRight } from 'react-icons/lu';
import Logo from '@/components/shared/Logo';
import ThemeToggle from '@/components/shared/ThemeToggle';
import { primaryNav } from '@/config/nav';
import { useAbout } from '@/hooks/usePublicData';

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { data: about } = useAbout();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: scrolled ? 'background.default' : 'transparent',
          borderBottom: '1px solid',
          borderColor: scrolled ? 'divider' : 'transparent',
          backdropFilter: scrolled ? 'blur(14px)' : 'none',
          transition: 'all 200ms ease',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ py: 1.5, justifyContent: 'space-between' }}>
            <Logo name={about?.fullName?.split(' ')[0] || 'Portfolio'} />

            <Stack direction="row" spacing={0.5} sx={{ display: { xs: 'none', md: 'flex' } }}>
              {primaryNav.map((item) => {
                const active = pathname === item.href;
                return (
                  <Button
                    key={item.href}
                    component={Link}
                    href={item.href}
                    sx={{
                      px: 1.75,
                      color: active ? 'primary.main' : 'text.secondary',
                      fontWeight: active ? 700 : 500,
                      '&:hover': { color: 'primary.main', bgcolor: 'transparent' },
                    }}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </Stack>

            <Stack direction="row" spacing={1.25} alignItems="center">
              <ThemeToggle />
              <Button
                component={Link}
                href="/contact"
                variant="contained"
                endIcon={<LuArrowUpRight size={16} />}
                sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
              >
                Hire me
              </Button>
              <IconButton
                onClick={() => setDrawerOpen(true)}
                sx={{ display: { xs: 'inline-flex', md: 'none' } }}
                aria-label="Open menu"
              >
                <LuMenu size={22} />
              </IconButton>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 280, pt: 2 }} role="presentation">
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 2, mb: 1 }}>
            <Logo name={about?.fullName?.split(' ')[0] || 'Portfolio'} />
            <IconButton onClick={() => setDrawerOpen(false)} aria-label="Close menu">
              <LuX size={20} />
            </IconButton>
          </Stack>
          <Divider sx={{ mb: 1 }} />
          <List>
            {primaryNav.map((item) => (
              <ListItemButton
                key={item.href}
                component={Link}
                href={item.href}
                selected={pathname === item.href}
                onClick={() => setDrawerOpen(false)}
              >
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
