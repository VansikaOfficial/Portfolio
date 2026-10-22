'use client';

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Stack, CircularProgress } from '@mui/material';
import { LuX } from 'react-icons/lu';

export default function AdminFormDialog({
  open,
  title,
  onClose,
  onSubmit,
  isSaving,
  children,
  maxWidth = 'sm',
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  onSubmit: () => void;
  isSaving?: boolean;
  children: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg';
}) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth={maxWidth}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {title}
        <IconButton onClick={onClose} size="small" aria-label="Close">
          <LuX size={18} />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2.5} sx={{ pt: 0.5 }}>
          {children}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={onSubmit}
          variant="contained"
          disabled={isSaving}
          startIcon={isSaving ? <CircularProgress size={16} color="inherit" /> : undefined}
        >
          {isSaving ? 'Saving…' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
