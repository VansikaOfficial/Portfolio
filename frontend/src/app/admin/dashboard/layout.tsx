'use client';

import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import AdminSidebar, { DRAWER_WIDTH_EXPANDED, DRAWER_WIDTH_COLLAPSED } from '@/components/admin/AdminSidebar';
import AdminTopbar from '@/components/admin/AdminTopbar';

const SIDEBAR_COLLAPSED_STORAGE_KEY = 'pcms_admin_sidebar_collapsed';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(SIDEBAR_COLLAPSED_STORAGE_KEY);
      if (saved !== null) {
        setCollapsed(saved === 'true');
      }
    } catch {
      // localStorage may be restricted in some environments
    }
  }, []);

  const handleToggleCollapse = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(SIDEBAR_COLLAPSED_STORAGE_KEY, String(next));
      } catch {
        // ignore storage errors
      }
      return next;
    });
  };

  const currentDrawerWidth = collapsed ? DRAWER_WIDTH_COLLAPSED : DRAWER_WIDTH_EXPANDED;

  return (
    <ProtectedRoute>
      <Box sx={{ display: 'flex', minHeight: '100dvh' }}>
        <AdminSidebar
          mobileOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
          collapsed={collapsed}
          onToggleCollapse={handleToggleCollapse}
        />
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            width: { md: `calc(100% - ${currentDrawerWidth}px)` },
            transition: (theme) =>
              theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
          }}
        >
          <AdminTopbar onMenuClick={() => setMobileOpen(true)} />
          <Box component="main" sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
            {children}
          </Box>
        </Box>
      </Box>
    </ProtectedRoute>
  );
}
