'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  Stack,
  Typography,
  Chip,
  IconButton,
  Tabs,
  Tab,
  Box,
  Skeleton,
  Tooltip,
} from '@mui/material';
import { LuTrash2, LuMailOpen, LuMail } from 'react-icons/lu';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import EmptyState from '@/components/shared/EmptyState';
import { confirmDelete, toastSuccess, toastError, extractErrorMessage } from '@/lib/adminAlerts';
import { messagesAdminApi } from '@/lib/adminApi';
import { Message } from '@/types';

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });

export default function MessagesAdminPage() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  const { data: messages, isLoading } = useQuery({
    queryKey: ['admin-messages', filter],
    queryFn: () => messagesAdminApi.list(filter === 'all' ? undefined : filter === 'unread' ? false : true),
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-messages'] });
    queryClient.invalidateQueries({ queryKey: ['admin', 'messages', 'unread-count'] });
  };

  const markReadMutation = useMutation({
    mutationFn: (id: string) => messagesAdminApi.markAsRead(id),
    onSuccess: invalidate,
    onError: (err) => toastError(extractErrorMessage(err, 'Failed to update message')),
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => messagesAdminApi.remove(id),
    onSuccess: () => {
      invalidate();
      toastSuccess('Message deleted');
    },
    onError: (err) => toastError(extractErrorMessage(err, 'Failed to delete message')),
  });

  const handleDelete = async (msg: Message) => {
    if (await confirmDelete(`the message from "${msg.name}"`)) {
      await removeMutation.mutateAsync(msg.id);
    }
  };

  const list = messages || [];

  return (
    <>
      <AdminPageHeader title="Messages" description="Contact form submissions from your public site." />

      <Tabs value={filter} onChange={(_, v) => setFilter(v)} sx={{ mb: 3 }}>
        <Tab label="All" value="all" />
        <Tab label="Unread" value="unread" />
        <Tab label="Read" value="read" />
      </Tabs>

      {isLoading ? (
        <Stack spacing={1.5}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} variant="rounded" height={90} />
          ))}
        </Stack>
      ) : list.length === 0 ? (
        <EmptyState title="No messages" description="Contact form submissions will appear here." />
      ) : (
        <Stack spacing={1.5}>
          {list.map((msg) => (
            <Card key={msg.id} variant="outlined" sx={{ borderColor: msg.isRead ? 'divider' : 'primary.main' }}>
              <CardContent sx={{ p: 2.5 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5, flexWrap: 'wrap', gap: 0.5 }}>
                      <Typography variant="subtitle2" fontWeight={700}>
                        {msg.name}
                      </Typography>
                      {!msg.isRead && <Chip label="New" size="small" color="primary" />}
                      <Typography variant="caption" color="text.secondary">
                        {msg.email}
                      </Typography>
                    </Stack>
                    {msg.subject && (
                      <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
                        {msg.subject}
                      </Typography>
                    )}
                    <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
                      {msg.message}
                    </Typography>
                    <Typography variant="caption" className="mono" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                      {formatDate(msg.createdAt)}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={0.5}>
                    <Tooltip title={msg.isRead ? 'Already read' : 'Mark as read'}>
                      <span>
                        <IconButton size="small" onClick={() => markReadMutation.mutate(msg.id)} disabled={msg.isRead}>
                          {msg.isRead ? <LuMailOpen size={16} /> : <LuMail size={16} />}
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" color="error" onClick={() => handleDelete(msg)}>
                        <LuTrash2 size={16} />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </>
  );
}
