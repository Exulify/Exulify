"use client";

import { useState } from 'react';
import { Calendar, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import Sidebar from '../components/Sidebar';
import { useSession } from '@/services/hooks/userSession';
import { addKehadiran } from '@/services/eskul';
import Image from 'next/image';

// Asumsi tipe payload Anda
interface KehadiranPayload {
  id_pendaftaran: number;
  tanggal: string;
  keterangan: 'Hadir'; // Hardcoded sesuai permintaan
}

export default function StudentDashboard() {
  const { user, loading: loadingSession, error: sessionError } = useSession();
  const [isRecording, setIsRecording] = useState(false);
  const [recordMessage, setRecordMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Ambil ID Pendaftar dari sesi. Perhatikan bahwa di backend,
  // Anda mengisi 'id_pendaftaran' dari tabel pendaftaran ke object user.
  // Maka, gunakan user.id_pendaftar.
  const id_pendaftaran = user?.id_pendaftaran;
  
  const handleAddKehadiran = async () => {
    setRecordMessage(null); // Reset pesan
    
    // Periksa apakah sesi telah dimuat, user ada, dan id_pendaftar tersedia
    if (loadingSession || !id_pendaftaran) {
      if (!id_pendaftaran) {
        setRecordMessage({ type: 'error', text: 'Error: ID Pendaftar tidak ditemukan dalam sesi.' });
      }
      return;
    }

    setIsRecording(true);

    const today = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
    
    // Payload dengan keterangan hardcode 'Hadir'
    const payload: KehadiranPayload = {
      id_pendaftaran: id_pendaftaran,
      tanggal: today,
      keterangan: 'Hadir'
    };

    try {
      const result = await addKehadiran(payload);
      
      if (result.success) {
        setRecordMessage({ type: 'success', text: `Kehadiran berhasil dicatat untuk ${today}!` });
      } else {
        setRecordMessage({ type: 'error', text: result.message || 'Gagal mencatat kehadiran.' });
      }
      
    } catch (error) {
      console.error("Error mencatat kehadiran:", error);
      setRecordMessage({ type: 'error', text: 'Terjadi kesalahan jaringan saat mencatat kehadiran.' });
    } finally {
      setIsRecording(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">

        <Sidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{loadingSession ? '...' : user?.name ? `Halo, ${user.name} ! ` : user?.id ? `Halo, user ${user.id}` : 'Halo! Selamat Datang'}</h1>
              <p className="text-gray-600 text-sm mt-1">Welcome back to your student dashboard</p>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Student Dashboard</h2>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-8">
            {/* ... (Stat Cards) ... */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Kehadiran</p>
                  <p className="text-4xl font-bold text-gray-900 mt-2">0%</p>
                </div>
                <CheckCircle className="w-12 h-12 text-blue-400 opacity-20" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Ekstrakurikuler Di ikuti</p>
                  <p className="text-4xl font-bold text-gray-900 mt-2">0</p>
                </div>
                <Calendar className="w-12 h-12 text-blue-400 opacity-20" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Jumlah Aktivitas Bulan Ini</p>
                  <p className="text-4xl font-bold text-gray-900 mt-2">0</p>
                </div>
                <AlertCircle className="w-12 h-12 text-blue-400 opacity-20" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-8">
            {/* ... (Weekly Activity Chart) ... */}
            <div className="col-span-2 bg-white rounded-2xl p-8 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Weekly Activity</h3>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={[
                    { day: 'Sat', value: 0 },
                    { day: 'Sun', value: 0 },
                    { day: 'Mon', value: 0 },
                    { day: 'Tue', value: 0 },
                    { day: 'Wed', value: 0 },
                    { day: 'Thu', value: 0 },
                    { day: 'Fri', value: 0 },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="day" stroke="#555" />
                  <YAxis stroke="#555" />
                  <Tooltip />
                  <Bar dataKey="value" fill="#5B9BD5" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Daily Activity & Record Presence Button */}
            <div className="bg-white rounded-2xl p-8 shadow-sm flex flex-col">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Daily Activity</h3>
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                
                {recordMessage && (
                  <div className={`p-2 mb-4 w-full text-sm rounded ${recordMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {recordMessage.text}
                  </div>
                )}
                
                <div className="text-6xl mb-4"><Image src="/onstreak.png" alt="offsteak" width={100} height={20}/></div>
                <p className="text-blue-500 font-medium text-sm">You aren't record any</p>
                <p className="text-blue-500 font-medium text-sm">Presence this day</p>
              </div>
              
              <button 
                onClick={handleAddKehadiran}
                disabled={isRecording || loadingSession || !id_pendaftaran}
                className="w-full py-3 bg-gradient-to-r from-[#5B9BD5] to-[#2D5F7F] text-white rounded-xl font-medium hover:shadow-lg transition-shadow text-sm disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                {isRecording ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Recording...
                  </>
                ) : (
                  'Record Presence'
                )}
              </button>
              
              {!id_pendaftaran && !loadingSession && (
                 <p className="text-xs text-red-500 mt-2 text-center">Tidak memiliki ID Pendaftar.</p>
              )}
            </div>
          </div>

          {/* ... (Recent Presence Records) ... */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Presence Records</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <div>
                    <p className="font-medium text-gray-900">Presence</p>
                    <p className="text-sm text-gray-600">21 January 2021</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-600">+1</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <div>
                    <p className="font-medium text-gray-900">Presence</p>
                    <p className="text-sm text-gray-600">21 January 2021</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-600">+1</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <div>
                    <p className="font-medium text-gray-900">Presence</p>
                    <p className="text-sm text-gray-600">21 January 2021</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-600">+1</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}