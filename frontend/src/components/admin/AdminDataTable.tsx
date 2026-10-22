'use client';

import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  IconButton,
  Stack,
  Skeleton,
  Tooltip,
} from '@mui/material';
import { LuPencil, LuTrash2 } from 'react-icons/lu';
import EmptyState from '@/components/shared/EmptyState';

export interface AdminColumn<T> {
  header: string;
  render: (row: T) => React.ReactNode;
  width?: string | number;
}

export default function AdminDataTable<T extends { id: string }>({
  columns,
  rows,
  isLoading,
  onEdit,
  onDelete,
  emptyTitle = 'No records yet',
  emptyDescription = 'Add your first entry using the button above.',
}: {
  columns: AdminColumn<T>[];
  rows: T[];
  isLoading?: boolean;
  onEdit: (row: T) => void;
  onDelete: (row: T) => void;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  if (isLoading) {
    return (
      <Stack spacing={1}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} variant="rounded" height={54} />
        ))}
      </Stack>
    );
  }

  if (rows.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small">
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell key={col.header} sx={{ fontWeight: 700, width: col.width }}>
                {col.header}
              </TableCell>
            ))}
            <TableCell align="right" sx={{ fontWeight: 700, width: 96 }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id} hover>
              {columns.map((col) => (
                <TableCell key={col.header}>{col.render(row)}</TableCell>
              ))}
              <TableCell align="right">
                <Tooltip title="Edit">
                  <IconButton size="small" onClick={() => onEdit(row)} aria-label="Edit">
                    <LuPencil size={15} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton size="small" onClick={() => onDelete(row)} aria-label="Delete" color="error">
                    <LuTrash2 size={15} />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
