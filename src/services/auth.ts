import Cookies from 'js-cookie';
import { apiFetch } from '@/app/lib/db';

// interface AuthResponse{
//   success: boolean;
//   token?: string;
//   message?: string;
// }

export async function loginUser(username: string, password: string) {
  const data = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });

  if (data.success && data.token) {
    Cookies.set('token', data.token, { expires: 7, secure: true, sameSite: 'strict' });
  }

  return data;
}

export async function registerUser(formData: any) {
  const data = await apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify(formData),
  });

  if (data.success && data.token) {
    Cookies.set('token', data.token, { expires: 7, secure: true, sameSite: 'strict' });
  }

  return data;
}

export function logoutUser() {
  Cookies.remove('token');
}

export function getToken() {
  return Cookies.get('token');
}
