"use client";

import { useState, useEffect } from 'react';
import { Users, Plus, Edit2, Trash2, Loader2, ChevronDown, X } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { getAllUsers, createUser, updateUserRole, deleteUser, User, CreateUserPayload } from '@/services/user';
import { useSession } from '@/services/hooks/userSession';

const ROLE_OPTIONS = [
  { value: 'siswa', label: 'Siswa' },
  { value: 'pembina', label: 'Pembina' },
  { value: 'admin', label: 'Admin' },
] as const;

export default function AdminDashboard() {
  const { user: adminUser, loading: sessionLoading } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [editingRole, setEditingRole] = useState<string>('siswa');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [newUserForm, setNewUserForm] = useState<CreateUserPayload>({
    username: '',
    nama: '',
    password: '',
    role: 'siswa',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const result = await getAllUsers();
      if (result.success) {
        setUsers(result.data || []);
      } else {
        setMessage({ type: 'error', text: result.message || 'Gagal mengambil data pengguna.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Terjadi kesalahan saat mengambil data pengguna.' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    if (!newUserForm.username || !newUserForm.nama || !newUserForm.password) {
      setMessage({ type: 'error', text: 'Semua field wajib diisi.' });
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await createUser(newUserForm);
      if (result.success) {
        setMessage({ type: 'success', text: 'Pengguna berhasil dibuat.' });
        setNewUserForm({ username: '', nama: '', password: '', role: 'siswa' });
        setShowCreateModal(false);
        await fetchUsers();
      } else {
        setMessage({ type: 'error', text: result.message || 'Gagal membuat pengguna.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Terjadi kesalahan saat membuat pengguna.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateRole = async (userId: number, newRole: string) => {
    try {
      setIsSubmitting(true);
      const result = await updateUserRole({
        id: userId,
        role: newRole as 'siswa' | 'pembina' | 'admin',
      });
      if (result.success) {
        setMessage({ type: 'success', text: 'Peran pengguna berhasil diperbarui.' });
        setEditingUserId(null);
        await fetchUsers();
      } else {
        setMessage({ type: 'error', text: result.message || 'Gagal memperbarui peran.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Terjadi kesalahan saat memperbarui peran.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) return;

    try {
      setIsSubmitting(true);
      const result = await deleteUser(userId);
      if (result.success) {
        setMessage({ type: 'success', text: 'Pengguna berhasil dihapus.' });
        await fetchUsers();
      } else {
        setMessage({ type: 'error', text: result.message || 'Gagal menghapus pengguna.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Terjadi kesalahan saat menghapus pengguna.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.nama?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const userStats = {
    total: users.length,
    siswa: users.filter((u) => u.role === 'siswa').length,
    pembina: users.filter((u) => u.role === 'pembina').length,
    admin: users.filter((u) => u.role === 'admin').length,
  };

  if (sessionLoading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 text-sm mt-1">Kelola pengguna dan peran di sistem</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#5B9BD5] to-[#2D5F7F] text-white rounded-lg font-medium hover:shadow-lg transition-shadow"
            >
              <Plus className="w-4 h-4" />
              Tambah Pengguna
            </button>
          </div>

          {message && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                message.type === 'success'
                  ? 'bg-green-100 text-green-700 border border-green-300'
                  : 'bg-red-100 text-red-700 border border-red-300'
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <p className="text-gray-600 text-sm font-medium">Total Pengguna</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{userStats.total}</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <p className="text-gray-600 text-sm font-medium">Siswa</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{userStats.siswa}</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <p className="text-gray-600 text-sm font-medium">Pembina</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">{userStats.pembina}</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <p className="text-gray-600 text-sm font-medium">Admin</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">{userStats.admin}</p>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Daftar Pengguna</h2>
              <input
                type="text"
                placeholder="Cari pengguna..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
              />
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-8 text-gray-600">Tidak ada pengguna ditemukan</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Username</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Nama Lengkap</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Role</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4 text-gray-900">{user.username}</td>
                        <td className="py-3 px-4 text-gray-900">{user.nama}</td>
                        <td className="py-3 px-4">
                          {editingUserId === user.id ? (
                            <select
                              value={editingRole}
                              onChange={(e) => setEditingRole(e.target.value)}
                              className="px-3 py-1 border-2 border-blue-400 rounded text-sm"
                            >
                              {ROLE_OPTIONS.map((role) => (
                                <option key={role.value} value={role.value}>
                                  {role.label}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${
                                user.role === 'admin'
                                  ? 'bg-orange-100 text-orange-700'
                                  : user.role === 'pembina'
                                  ? 'bg-purple-100 text-purple-700'
                                  : 'bg-blue-100 text-blue-700'
                              }`}
                            >
                              {ROLE_OPTIONS.find((r) => r.value === user.role)?.label || user.role}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex justify-center gap-2">
                            {editingUserId === user.id ? (
                              <>
                                <button
                                  onClick={() => handleUpdateRole(user.id!, editingRole)}
                                  disabled={isSubmitting}
                                  className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 disabled:opacity-50"
                                >
                                  Simpan
                                </button>
                                <button
                                  onClick={() => setEditingUserId(null)}
                                  className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
                                >
                                  Batal
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => {
                                    setEditingUserId(user.id!);
                                    setEditingRole(user.role);
                                  }}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                  title="Edit peran"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteUser(user.id!)}
                                  disabled={isSubmitting}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                                  title="Hapus pengguna"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Tambah Pengguna Baru</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  value={newUserForm.username}
                  onChange={(e) => setNewUserForm({ ...newUserForm, username: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                  placeholder="contoh@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={newUserForm.nama}
                  onChange={(e) => setNewUserForm({ ...newUserForm, nama: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                  placeholder="Masukkan nama lengkap"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={newUserForm.password}
                  onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                  placeholder="Masukkan password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Peran</label>
                <select
                  value={newUserForm.role}
                  onChange={(e) =>
                    setNewUserForm({
                      ...newUserForm,
                      role: e.target.value as 'siswa' | 'pembina' | 'admin',
                    })
                  }
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                >
                  {ROLE_OPTIONS.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>

              {newUserForm.role === 'siswa' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">NIS (Nomor Induk Siswa)</label>
                  <input
                    type="text"
                    value={(newUserForm as any).nis || ''}
                    onChange={(e) => setNewUserForm({ ...newUserForm, nis: e.target.value } as any)}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                    placeholder="Masukkan NIS"
                  />
                </div>
              )}

              {newUserForm.role === 'pembina' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">NIP (Nomor Induk Pembina)</label>
                  <input
                    type="text"
                    value={(newUserForm as any).nip || ''}
                    onChange={(e) => setNewUserForm({ ...newUserForm, nip: e.target.value } as any)}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                    placeholder="Masukkan NIP"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCreateUser}
                disabled={isSubmitting}
                className="flex-1 py-2 bg-gradient-to-r from-[#5B9BD5] to-[#2D5F7F] text-white rounded-lg font-medium hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Membuat...
                  </>
                ) : (
                  'Buat Pengguna'
                )}
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
