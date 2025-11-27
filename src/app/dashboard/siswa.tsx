"use client";

import { useState, useEffect } from 'react';
import { Calendar, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import Sidebar from '../components/Sidebar';
import { EskulDropdown } from '../components/DropdownEskul';
import { useSession } from '@/services/hooks/userSession';
import { getEskulUser } from '@/services/eskul';
import { addKehadiran } from '@/services/eskul';
import Image from 'next/image';

interface Eskul {
  id: number;
  nama: string;
  deskripsi: string;
  jadwal: string;
  id_pembina: number;
}

export default function StudentDashboard() {
  const { user, loading: loadingSession, error: sessionError } = useSession();
  const [isRecording, setIsRecording] = useState(false);
  const [recordMessage, setRecordMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [loadingEskul, setLoadingEskul] = useState(true);
  const [errorEskul, setErrorEskul] = useState<string | null>(null);
  const [eskul, setEskul] = useState<Eskul[]>([]);
  const [jumlahEskul, setJumlahEskul] = useState(0);
  const [selectedEskul, setSelectedEskul] = useState<Eskul | null>(null);
  
  // // Debug: log user object to console
  // useEffect(() => {
  //   if (user) {
  //     // eslint-disable-next-line no-console
  //     console.log('[DEBUG] User session data:', user);
  //   }
  // }, [user]);

  const id_pendaftaran = user?.id_pendaftar;

    useEffect(() => {
      const fetchData = async () => {
        if (!user?.id_siswa) return;
        const res = await getEskulUser(user.id_siswa);
        if (res.success) {
          setJumlahEskul(res.data?.length || 0);
        }
      };
      fetchData();
    }, [user]);
  
    useEffect(() => {
      let mounted = true;
      const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
    
      const fetchEskul = async () => {
        try {
          setLoadingEskul(true);
          const res = await fetch(`${base}/api/eskul`, {
            credentials: 'include',
          });
          const json = await res.json();
          if (!mounted) return;
    
          if (!res.ok) throw new Error(json.message || `HTTP ${res.status}`);
          setEskul(json.data || []);
          setErrorEskul(null);
        } catch (err: any) {
          if (!mounted) return;
          setErrorEskul(err.message || 'Failed to fetch eskul.');
        } finally {
          if (mounted) setLoadingEskul(false);
        }
      };
    
    fetchEskul();
    return () => { mounted = false; };
  }, []);

  const handleAddKehadiran = async () => {
    setRecordMessage(null);

    if (!selectedEskul) {
      setRecordMessage({ type: 'error', text: 'Pilih ekstrakurikuler terlebih dahulu.' });
      return;
    }

    if (loadingSession || !id_pendaftaran) {
      if (!id_pendaftaran) {
        setRecordMessage({ type: 'error', text: 'Error: ID Pendaftar tidak ditemukan dalam sesi.' });
      }
      return;
    }

    setIsRecording(true);

    const today = new Date().toISOString().split('T')[0];

    const payload = {
      id_pendaftaran: id_pendaftaran,
      tanggal: today,
      keterangan: 'Hadir' as const
    };

    try {
      const result = await addKehadiran(payload);
      
      if (result.success) {
        setRecordMessage({ 
          type: 'success', 
          text: `Kehadiran berhasil dicatat untuk ${selectedEskul.nama} pada ${today}!` 
        });
      } else {
        setRecordMessage({ 
          type: 'error', 
          text: result.message || 'Gagal mencatat kehadiran.' 
        });
      }
      
    } catch (error) {
      console.error("Error mencatat kehadiran:", error);
      setRecordMessage({ type: 'error', text: 'Terjadi kesalahan jaringan saat mencatat kehadiran.' });
    } finally {
      setIsRecording(false);
    }
  };  return (
    <div className="flex h-screen bg-gray-50">

        <Sidebar />

      <main className="flex-1 overflow-auto m-8">
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
                  <p className="text-4xl font-bold text-gray-900 mt-2">{jumlahEskul}</p>
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

            <div className="bg-white rounded-2xl p-8 shadow-sm flex flex-col">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Record Presence</h3>
              <div className="flex-1 flex flex-col">
                
                {recordMessage && (
                  <div className={`p-3 mb-4 w-full text-sm rounded-lg ${recordMessage.type === 'success' ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-red-100 text-red-700 border border-red-300'}`}>
                    {recordMessage.text}
                  </div>
                )}

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ekstrakurikuler
                  </label>
                  <EskulDropdown 
                    selectedId={selectedEskul?.id}
                    onSelect={setSelectedEskul}
                  />
                </div>

                {selectedEskul && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <span className="font-medium">Dipilih:</span> {selectedEskul.nama}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">Jadwal: {selectedEskul.jadwal}</p>
                  </div>
                )}
              </div>
              
              <button 
                onClick={handleAddKehadiran}
                disabled={isRecording || loadingSession || !id_pendaftaran || !selectedEskul}
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
              {!selectedEskul && (
                 <p className="text-xs text-orange-500 mt-2 text-center">Pilih ekstrakurikuler untuk merekam kehadiran.</p>
              )}
            </div>
          </div>
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