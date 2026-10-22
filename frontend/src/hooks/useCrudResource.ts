import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createAdminCrud } from '@/lib/adminApi';
import { toastSuccess, toastError, extractErrorMessage } from '@/lib/adminAlerts';

export function useCrudResource<T extends { id: string }>(resourcePath: string, queryKey: string) {
  const client = createAdminCrud<T>(resourcePath);
  const queryClient = useQueryClient();

  const listQuery = useQuery({ queryKey: [queryKey], queryFn: client.list });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: [queryKey] });
    queryClient.invalidateQueries({ queryKey: [queryKey.replace('admin-', '')] }); // also bust public cache key if same tab
  };

  const createMutation = useMutation({
    mutationFn: (payload: Partial<T>) => client.create(payload),
    onSuccess: () => {
      invalidate();
      toastSuccess('Created successfully');
    },
    onError: (err) => toastError(extractErrorMessage(err, 'Failed to create')),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<T> }) => client.update(id, payload),
    onSuccess: () => {
      invalidate();
      toastSuccess('Updated successfully');
    },
    onError: (err) => toastError(extractErrorMessage(err, 'Failed to update')),
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => client.remove(id),
    onSuccess: () => {
      invalidate();
      toastSuccess('Deleted successfully');
    },
    onError: (err) => toastError(extractErrorMessage(err, 'Failed to delete')),
  });

  return {
    items: listQuery.data || [],
    isLoading: listQuery.isLoading,
    isError: listQuery.isError,
    create: createMutation.mutateAsync,
    update: updateMutation.mutateAsync,
    remove: removeMutation.mutateAsync,
    isSaving: createMutation.isPending || updateMutation.isPending,
    isDeleting: removeMutation.isPending,
  };
}
