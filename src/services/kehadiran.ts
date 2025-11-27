import { apiFetch } from '@/app/lib/db';

export interface KehadiranRow {
  kehadiran_id: number;
  siswa_nama: string;
  ekskul_nama: string;
  tanggal: string;
  keterangan: string;
}

export async function getKehadiranForPembina() {
  try {
    const data = await apiFetch('/kehadiran/pembina', {
      method: 'GET',
      credentials: 'include',
    });
    return data;
  } catch (err) {
    console.error('Error fetching kehadiran for pembina:', err);
    return { success: false, message: 'Gagal mengambil data kehadiran.' };
  }
}

export async function downloadKehadiranPdf(): Promise<Blob> {
  const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
  const res = await fetch(`${base}/kehadiran/export-csv`, {
    method: 'GET',
    credentials: 'include',
  });
  if (!res.ok) {
    let body = {} as any;
    try { body = await res.json(); } catch (_) {}
    throw new Error(body.message || res.statusText);
  }
  return await res.blob();
}
