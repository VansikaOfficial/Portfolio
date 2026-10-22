'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Typography,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  ListItemIcon,
  Divider,
  Tooltip,
} from '@mui/material';
import { LuMenu, LuMail, LuLogOut, LuExternalLink, LuKeyRound } from 'react-icons/lu';
import ThemeToggle from '@/components/shared/ThemeToggle';
import { useAuth } from '@/hooks/useAuth';
import { messagesAdminApi } from '@/lib/adminApi';

export default function AdminTopbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { data: unread } = useQuery({
    queryKey: ['admin', 'messages', 'unread-count'],
    queryFn: messagesAdminApi.unreadCount,
    refetchInterval: 60_000,
  });

  return (
    <AppBar
      position="sticky"
      elevation={0}
      color="transparent"
      sx={{ borderBottom: '1px solid', borderColor: 'divider', backdropFilter: 'blur(10px)' }}
    >
      <Toolbar sx={{ gap: 1 }}>
        <IconButton onClick={onMenuClick} sx={{ display: { xs: 'inline-flex', md: 'none' } }} aria-label="Open menu">
          <LuMenu size={20} />
        </IconButton>

        <Box sx={{ flex: 1 }} />

        <Tooltip title="View public site">
          <IconButton component={Link} href="/" target="_blank" aria-label="View public site">
            <LuExternalLink size={18} />
          </IconButton>
        </Tooltip>

        <Tooltip title="Messages">
          <IconButton component={Link} href="/admin/dashboard/messages" aria-label="Messages">
            <Badge badgeContent={unread?.count || 0} color="secondary">
              <LuMail size={18} />
            </Badge>
          </IconButton>
        </Tooltip>

        <ThemeToggle />

        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ ml: 0.5 }} aria-label="Account menu">
          <Avatar sx={{ width: 32, height: 32, fontSize: '0.9rem' }}>{user?.name?.[0] || 'A'}</Avatar>
        </IconButton>
        <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={() => setAnchorEl(null)}>
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="subtitle2" fontWeight={700}>
              {user?.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.email}
            </Typography>
          </Box>
          <Divider />
          <MenuItem component={Link} href="/admin/dashboard/change-password" onClick={() => setAnchorEl(null)}>
            <ListItemIcon>
              <LuKeyRound size={17} />
            </ListItemIcon>
            Change password
          </MenuItem>
          <MenuItem onClick={logout}>
            <ListItemIcon>
              <LuLogOut size={17} />
            </ListItemIcon>
            Sign out
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
