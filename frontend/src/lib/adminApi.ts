import { api, tokenStorage } from './axios';
import { ApiResponse, AuthResult, AdminUser, Message } from '@/types';

const unwrap = <T>(promise: Promise<{ data: ApiResponse<T> }>): Promise<T> =>
  promise.then((res) => res.data.data);

export const adminAuthApi = {
  login: (email: string, password: string) => unwrap<AuthResult>(api.post('/auth/login', { email, password })),
  logout: () => unwrap(api.post('/auth/logout')),
  me: () => unwrap<AdminUser>(api.get('/auth/me')),
  changePassword: (currentPassword: string, newPassword: string) =>
    unwrap(api.post('/auth/change-password', { currentPassword, newPassword })),
};

/**
 * Generic admin CRUD client factory bound to a REST resource path.
 * Mirrors the backend's generic CRUD controller for simple modules
 * (Skills, Education, Experience, Internships, Testimonials, SocialLinks).
 */
export function createAdminCrud<T>(resourcePath: string) {
  return {
    list: () => unwrap<T[]>(api.get(`/${resourcePath}`)),
    getOne: (id: string) => unwrap<T>(api.get(`/${resourcePath}/${id}`)),
    create: (payload: Partial<T>) => unwrap<T>(api.post(`/${resourcePath}`, payload)),
    update: (id: string, payload: Partial<T>) => unwrap<T>(api.put(`/${resourcePath}/${id}`, payload)),
    remove: (id: string) => unwrap<null>(api.delete(`/${resourcePath}/${id}`)),
  };
}

/** Uploads a file field via multipart/form-data, merged with any extra text fields */
export const uploadFile = <T>(
  url: string,
  method: 'post' | 'put',
  fieldName: string,
  file: File,
  extraFields: Record<string, unknown> = {}
): Promise<T> => {
  const formData = new FormData();
  formData.append(fieldName, file);
  Object.entries(extraFields).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (Array.isArray(value)) {
      value.forEach((v) => formData.append(key, String(v)));
    } else {
      formData.append(key, String(value));
    }
  });

  return unwrap<T>(
    api.request({
      url,
      method,
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  );
};

export const isAuthenticated = () => Boolean(tokenStorage.getAccessToken());

export const messagesAdminApi = {
  list: (isRead?: boolean) =>
    unwrap<Message[]>(api.get('/messages', { params: isRead === undefined ? {} : { isRead } })),
  unreadCount: () => unwrap<{ count: number }>(api.get('/messages/unread-count')),
  markAsRead: (id: string) => unwrap<Message>(api.patch(`/messages/${id}/read`)),
  remove: (id: string) => unwrap<null>(api.delete(`/messages/${id}`)),
};
