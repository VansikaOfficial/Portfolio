'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Box,
  Drawer,
  Stack,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Divider,
} from '@mui/material';
import { LuShieldCheck, LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import { adminNavGroups } from '@/config/adminNav';

export const DRAWER_WIDTH_EXPANDED = 260;
export const DRAWER_WIDTH_COLLAPSED = 72;
export const DRAWER_WIDTH = DRAWER_WIDTH_EXPANDED;

interface AdminSidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function AdminSidebar({
  mobileOpen,
  onClose,
  collapsed = false,
  onToggleCollapse,
}: AdminSidebarProps) {
  const pathname = usePathname();

  const renderContent = (isMobile: boolean) => {
    const isCollapsed = !isMobile && collapsed;

    return (
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Logo / Header */}
        <Stack
          direction="row"
          spacing={isCollapsed ? 0 : 1.25}
          alignItems="center"
          justifyContent={isCollapsed ? 'center' : 'flex-start'}
          sx={{
            px: isCollapsed ? 1 : 3,
            py: 3,
            minHeight: 80,
            boxSizing: 'border-box',
          }}
        >
          <Tooltip title={isCollapsed ? 'Admin Panel' : ''} placement="right" arrow>
            <Box
              sx={{
                width: 34,
                height: 34,
                minWidth: 34,
                borderRadius: '10px',
                display: 'grid',
                placeItems: 'center',
                background: 'linear-gradient(135deg, #2DD4BF, #F5A524)',
                color: '#04201C',
              }}
            >
              <LuShieldCheck size={18} />
            </Box>
          </Tooltip>
          {!isCollapsed && (
            <Typography
              sx={{
                fontFamily: 'var(--font-fraunces)',
                fontWeight: 600,
                fontSize: '1.05rem',
                whiteSpace: 'nowrap',
              }}
            >
              Admin Panel
            </Typography>
          )}
        </Stack>

        {/* Navigation list */}
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            px: isCollapsed ? 1 : 1.5,
            pb: 2,
          }}
        >
          {adminNavGroups.map((group, groupIndex) => (
            <Box key={group.title} sx={{ mb: isCollapsed ? 1 : 2 }}>
              {isCollapsed ? (
                groupIndex > 0 ? (
                  <Divider sx={{ my: 1.5, mx: 1, borderColor: 'divider' }} />
                ) : null
              ) : (
                <Typography
                  className="mono"
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    pl: 1.5,
                    display: 'block',
                    mb: 0.5,
                    letterSpacing: '0.08em',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {group.title.toUpperCase()}
                </Typography>
              )}
              <List dense disablePadding>
                {group.items.map((item) => {
                  const active = pathname === item.href;
                  const Icon = item.icon;

                  const buttonContent = (
                    <ListItemButton
                      component={Link}
                      href={item.href}
                      onClick={isMobile ? onClose : undefined}
                      selected={active}
                      sx={{
                        borderRadius: 2,
                        mb: 0.3,
                        minHeight: 44,
                        px: isCollapsed ? 0 : 1.5,
                        justifyContent: isCollapsed ? 'center' : 'initial',
                        color: active ? 'primary.main' : 'text.secondary',
                        '&.Mui-selected': { bgcolor: 'action.selected' },
                        '&:hover': { bgcolor: 'action.hover' },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: isCollapsed ? 0 : 34,
                          justifyContent: 'center',
                          color: 'inherit',
                        }}
                      >
                        <Icon size={18} />
                      </ListItemIcon>
                      {!isCollapsed && (
                        <ListItemText
                          primary={item.label}
                          primaryTypographyProps={{
                            fontSize: '0.88rem',
                            fontWeight: active ? 700 : 500,
                            whiteSpace: 'nowrap',
                          }}
                        />
                      )}
                    </ListItemButton>
                  );

                  return (
                    <Box key={item.href}>
                      {isCollapsed ? (
                        <Tooltip title={item.label} placement="right" arrow>
                          {buttonContent}
                        </Tooltip>
                      ) : (
                        buttonContent
                      )}
                    </Box>
                  );
                })}
              </List>
            </Box>
          ))}
        </Box>

        {/* Bottom Toggle/Collapse Button (desktop only) */}
        {!isMobile && onToggleCollapse && (
          <Box
            sx={{
              p: 1.25,
              borderTop: '1px solid',
              borderColor: 'divider',
            }}
          >
            {isCollapsed ? (
              <Tooltip title="Expand sidebar" placement="right" arrow>
                <ListItemButton
                  onClick={onToggleCollapse}
                  aria-label="Expand sidebar"
                  sx={{
                    borderRadius: 2,
                    minHeight: 42,
                    justifyContent: 'center',
                    px: 0,
                    color: 'text.secondary',
                    '&:hover': { bgcolor: 'action.hover', color: 'primary.main' },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      justifyContent: 'center',
                      color: 'inherit',
                    }}
                  >
                    <LuChevronRight size={18} />
                  </ListItemIcon>
                </ListItemButton>
              </Tooltip>
            ) : (
              <ListItemButton
                onClick={onToggleCollapse}
                aria-label="Collapse sidebar"
                sx={{
                  borderRadius: 2,
                  minHeight: 42,
                  px: 1.5,
                  color: 'text.secondary',
                  '&:hover': { bgcolor: 'action.hover', color: 'primary.main' },
                }}
              >
                <ListItemIcon sx={{ minWidth: 34, color: 'inherit' }}>
                  <LuChevronLeft size={18} />
                </ListItemIcon>
                <ListItemText
                  primary="Collapse"
                  primaryTypographyProps={{
                    fontSize: '0.84rem',
                    fontWeight: 500,
                  }}
                />
              </ListItemButton>
            )}
          </Box>
        )}
      </Box>
    );
  };

  const desktopDrawerWidth = collapsed ? DRAWER_WIDTH_COLLAPSED : DRAWER_WIDTH_EXPANDED;

  return (
    <>
      {/* Mobile temporary drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH_EXPANDED,
            boxSizing: 'border-box',
          },
        }}
      >
        {renderContent(true)}
      </Drawer>

      {/* Desktop permanent drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: desktopDrawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: desktopDrawerWidth,
            boxSizing: 'border-box',
            borderRight: '1px solid',
            borderColor: 'divider',
            overflowX: 'hidden',
            transition: (theme) =>
              theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
          },
        }}
        open
      >
        {renderContent(false)}
      </Drawer>
    </>
  );
}
