'use client';
import React, { useEffect, useState } from 'react';
import { BookOpen, Music, Trophy, Palette, Code, Users, Dumbbell, Globe } from 'lucide-react';
import { useSession } from '@/services/hooks/userSession';

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

  const { user, loading: loadingSession, error: sessionError } = useSession();

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#2D5F7F] to-[#5B9BD5] bg-clip-text text-transparent">
            Exulify
          </h1>
          <div className="flex items-center space-x-4 font-bold">
            <a href="/D" className="text-gray-700 hover:text-[#5B9BD5] transition-colors">
              {/* show meaningful label depending on available user fields */}
              {loadingSession ? '...' : user?.name ? `Halo, ${user.name}` : user?.id ? `Halo, user ${user.id}` : 'Masuk'}
            </a>
          </div>
        </div>
      </nav>

      {/* Optional: show session error for debugging */}
      {sessionError && <div className="text-sm text-red-500 p-2">Session: {sessionError}</div>}

      <div className="mb-12 m-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Selamat Datang!</h2>
        <p className="text-gray-600 text-lg">Mulai cari ekstrakurikuler yang kamu minati!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 m-16">
        {eskul.map((item, index) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer hover:-translate-y-1"
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

              <button className="w-full py-2.5 bg-gradient-to-r from-[#2D5F7F] to-[#1F4A61] text-white rounded-lg font-medium text-sm hover:shadow-lg transition-all">
                Join Club
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}