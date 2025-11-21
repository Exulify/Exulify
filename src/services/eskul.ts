import { apiFetch } from '@/app/lib/db';

interface JoinEskulPayload {
  id_siswa: number;
  id_ekskul: number;
  tanggal_daftar: string;
  status: string;
}

export async function joinEskul(payload: JoinEskulPayload) {
  try {
    const data = await apiFetch('/eskul/add-pendaftar', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(payload)
    });

    return data;

  } catch (error) {
    console.error("Error joinEskul:", error);
    return { success: false, message: "Terjadi kesalahan" };
  }
}


export async function getEskulUser(id_siswa: number) {
  return await apiFetch(`/eskul/siswa/${id_siswa}`);
}

