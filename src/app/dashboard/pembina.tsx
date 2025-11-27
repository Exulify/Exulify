"use client";
import Sidebar from '../components/Sidebar';
import { useSession } from '@/services/hooks/userSession';
import { useEffect, useState } from 'react';
import { getKehadiranForPembina, downloadKehadiranPdf, KehadiranRow } from '@/services/kehadiran';
import { saveAs } from 'file-saver';

export default function PembinaDashboard() {

  const { user, loading: loadingSession, error: sessionError } = useSession();
  const [kehadiran, setKehadiran] = useState<KehadiranRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const res = await getKehadiranForPembina();
        if (res && res.success) {
          setKehadiran(res.data || []);
        } else {
          setError(res?.message || 'Gagal mengambil data kehadiran');
        }
      } catch (err: any) {
        setError(err.message || String(err));
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  async function handleExportPdf() {
    try {
  const blob = await downloadKehadiranPdf();
  saveAs(blob, 'kehadiran.csv');
    } catch (err: any) {
      console.error('Export PDF failed', err);
      setError(err.message || 'Gagal mengekspor PDF');
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">

        <Sidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{loadingSession ? '...' : user?.name ? `Halo, ${user.name} ! ` : user?.id ? `Halo, user ${user.id}` : 'Halo! Selamat Datang'}</h1>
              <p className="text-gray-600 text-sm mt-1">Welcome back to your dashboard</p>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Pembina Dashboard</h2>
          </div>
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Daftar Kehadiran</h3>
              <div>
                <button onClick={handleExportPdf} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Export PDF</button>
              </div>
            </div>
            {loading && <p className="text-sm text-gray-500 mt-2">Memuat data...</p>}
            {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
            <div className="mt-4 overflow-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-black">#</th>
                    <th className="px-4 py-2 text-left text-black">Siswa</th>
                    <th className="px-4 py-2 text-left text-black">Ekskul</th>
                    <th className="px-4 py-2 text-left text-black">Tanggal</th>
                    <th className="px-4 py-2 text-left text-black">Keterangan</th>
                  </tr>
                </thead>
                <tbody>
                  {kehadiran.map((row, idx) => (
                    <tr key={row.kehadiran_id} className={idx % 2 === 0 ? 'bg-gray-50' : ''}>
                      <td className="px-4 py-2 text-black">{idx + 1}</td>
                      <td className="px-4 py-2 text-black">{row.siswa_nama}</td>
                      <td className="px-4 py-2 text-black">{row.ekskul_nama}</td>
                      <td className="px-4 py-2 text-black">{row.tanggal}</td>
                      <td className="px-4 py-2 text-black">{row.keterangan}</td>
                    </tr>
                  ))}
                  {kehadiran.length === 0 && !loading && (
                    <tr>
                      <td colSpan={5} className="px-4 py-6 text-center text-sm text-gray-500">Tidak ada data kehadiran</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
