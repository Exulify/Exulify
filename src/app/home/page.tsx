'use client';
import React, { useEffect, useState } from 'react';
import { BookOpen, Music, Trophy, Palette, Code, Users, Dumbbell, Globe, CheckCircle, Calendar, AlertCircle } from 'lucide-react';
import { useSession } from '@/services/hooks/userSession';
import { joinEskul, getEskulUser } from '@/services/eskul';
import Link from 'next/link';
import ForbiddenPage from './forbidden';
import Sidebar from '../components/Sidebar';

interface Eskul {
  id: number;
  nama: string;
  deskripsi: string;
  jadwal: string;
  id_pembina: number;
}

export default function HomePage() {
  const [eskul, setEskul] = useState<Eskul[]>([]);
  const [loadingEskul, setLoadingEskul] = useState(true);
  const [errorEskul, setErrorEskul] = useState<string | null>(null);
  const [jumlahEskul, setJumlahEskul] = useState(0);

  const { user, loading: loadingSession, error: sessionError } = useSession();

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

  const handleJoin = async (id_eskul: number) => {
    if (!user?.id_siswa) return;

    const payload = {
      id_siswa: user.id_siswa,
      id_ekskul: id_eskul,
      tanggal_daftar: new Date().toISOString().split("T")[0],
      status: "aktif"
    };

    const res = await joinEskul(payload);

    if (res.success) {
      alert("Berhasil daftar eskul!");
    } else {
      alert("Gagal daftar: " + res.message);
    }
  };
    if (!user) {
      return <ForbiddenPage />;
    }

  if (loadingEskul)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600 text-lg">
        Loading data eskul...
      </div>
    );

  if (errorEskul)
    return (
      <div className="flex justify-center items-center min-h-screen text-red-600 text-lg">
        Error: {errorEskul}
      </div>
    );




  const icons = [<Users key="u"/>, <Music key="m"/>, <Trophy key="t"/>, <Palette key="p"/>, <Code key="c"/>, <BookOpen key="b"/>, <Dumbbell key="d"/>, <Globe key="g"/>];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">

      <Sidebar />

    <div className="flex-1 px-8">
      {sessionError && <div className="text-sm text-red-500 p-2">Session: {sessionError}</div>}

      <div className="mb-12 m-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{loadingSession ? '...' : user?.name ? `Halo, ${user.name} ! ` : user?.id ? `Halo, user ${user.id}` : 'Halo! Selamat Datang'}</h2>
        <p className="text-gray-600 text-lg">Mulai cari ekstrakurikuler yang kamu minati!</p>

                <div className="grid grid-cols-3 gap-6 mb-8 mt-8">
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 m-16">
        {eskul.map((item, index) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer hover:-translate-y-1"
          >
            <div className="h-24 bg-gradient-to-r from-[#5B9BD5] to-[#2D5F7F] flex items-center justify-center text-white opacity-80 group-hover:opacity-100 transition-opacity">
              {icons[index % icons.length]}
            </div>

            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">{item.nama}</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">{item.deskripsi}</p>

              <div className="flex items-center justify-between mb-4">
                <span className="inline-block px-3 py-1 bg-blue-50 text-[#2D5F7F] text-xs font-semibold rounded-full">
                  Jadwal: {item.jadwal}
                </span>
              </div>

              <button disabled={!user?.id} onClick={() => handleJoin(item.id)} className="w-full py-2.5 bg-gradient-to-r from-[#2D5F7F] to-[#1F4A61] text-white rounded-lg font-medium text-sm hover:shadow-lg transition-all">
                Join Club
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}