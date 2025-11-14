'use client';
import { useEffect, useState } from 'react';
import { BookOpen, Music, Trophy, Palette, Code, Users, Dumbbell, Globe } from 'lucide-react';

interface Eskul {
  id: number;
  nama: string;
  deskripsi: string;
  jadwal: string;
  id_pembina: number;
}

export default function HomePage() {
  const [eskul, setEskul] = useState<Eskul[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEskul = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/eskul', {
          method: 'GET',
          credentials: 'include',
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || 'Gagal mengambil data.');

        setEskul(data.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEskul();
  }, []);

  

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600 text-lg">
        Loading data eskul...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen text-red-600 text-lg">
        Error: {error}
      </div>
    );

  const icons = [<Users />, <Music />, <Trophy />, <Palette />, <Code />, <BookOpen />, <Dumbbell />, <Globe />];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#2D5F7F] to-[#5B9BD5] bg-clip-text text-transparent">
            Exulify
          </h1>
          <div className="flex items-center space-x-4 font-bold">
            <a href="/D" className="text-gray-700 hover:text-[#5B9BD5] transition-colors">
              Dashboard
            </a>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Selamat Datang! ${user.name}</h2>
          <p className="text-gray-600 text-lg">Discover and join clubs that match your interests</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
      </main>
    </div>
  );
}
