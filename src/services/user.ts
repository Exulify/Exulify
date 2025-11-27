import { apiFetch } from '@/app/lib/db';

export interface User {
  id?: number;
  username: string;
  nama?: string;
  email?: string;
  password?: string;
  role: 'siswa' | 'pembina' | 'admin';
  id_siswa?: number;
  id_pembina?: number;
  created_at?: string;
}

export interface CreateUserPayload {
  username: string;
  nama: string;
  password: string;
  role: 'siswa' | 'pembina' | 'admin';
  nis?: string;
  nip?: string;
}

export interface UpdateUserRolePayload {
  id: number;
  role: 'siswa' | 'pembina' | 'admin';
}

export async function getAllUsers() {
  try {
    const data = await apiFetch('/user', {
      method: 'GET',
      credentials: 'include',
    });
    return data;
  } catch (error) {
    console.error('Error fetching users:', error);
    return { success: false, message: 'Gagal mengambil data pengguna.' };
  }
}

export async function createUser(payload: CreateUserPayload) {
  try {
    const data = await apiFetch('/user/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    return data;
  } catch (error) {
    console.error('Error creating user:', error);
    return { success: false, message: 'Gagal membuat pengguna baru.' };
  }
}

export async function updateUserRole(payload: UpdateUserRolePayload) {
  try {
    const data = await apiFetch('/user/update-role', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    return data;
  } catch (error) {
    console.error('Error updating user role:', error);
    return { success: false, message: 'Gagal memperbarui peran pengguna.' };
  }
}

export async function deleteUser(id: number) {
  try {
    const data = await apiFetch(`/user/delete/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    return data;
  } catch (error) {
    console.error('Error deleting user:', error);
    return { success: false, message: 'Gagal menghapus pengguna.' };
  }
}
