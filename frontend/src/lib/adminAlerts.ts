import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export const confirmDelete = async (itemName = 'this item'): Promise<boolean> => {
  const result = await MySwal.fire({
    icon: 'warning',
    title: 'Are you sure?',
    text: `This will permanently delete ${itemName}. This action cannot be undone.`,
    showCancelButton: true,
    confirmButtonText: 'Delete',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#F87171',
    cancelButtonColor: '#64748B',
    reverseButtons: true,
  });
  return result.isConfirmed;
};

export const toastSuccess = (message: string) => {
  MySwal.fire({
    toast: true,
    position: 'top-end',
    icon: 'success',
    title: message,
    showConfirmButton: false,
    timer: 2200,
    timerProgressBar: true,
  });
};

export const toastError = (message: string) => {
  MySwal.fire({
    toast: true,
    position: 'top-end',
    icon: 'error',
    title: message,
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });
};

export const extractErrorMessage = (err: unknown, fallback = 'Something went wrong'): string => {
  const anyErr = err as any;
  return anyErr?.response?.data?.message || anyErr?.message || fallback;
};
