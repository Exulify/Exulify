import { useSession } from '@/services/hooks/userSession';
import { getEskulUser } from '@/services/eskul';
import { useEffect,  useState } from 'react';
import { BookOpen, Music, Trophy, Palette, Code, Users, Dumbbell, Globe, CheckCircle, Calendar, AlertCircle, ChevronDown } from 'lucide-react';

interface Eskul {
  id: number;
  nama: string;
  deskripsi: string;
  jadwal: string;
  id_pembina: number;
}

interface EskulDropdownProps {
  onSelect?: (eskul: Eskul) => void;
  selectedId?: number;
  showGrid?: boolean;
}

export function EskulDropdown({ onSelect, selectedId, showGrid = false }: EskulDropdownProps) {
  const { user, loading: loadingSession, error: sessionError } = useSession();
  const [eskul, setEskul] = useState<Eskul[]>([]);
  const [loadingEskul, setLoadingEskul] = useState(true);
  const [errorEskul, setErrorEskul] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

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

  const selectedEskul = eskul.find(e => e.id === selectedId);
  const icons = [<Users key="u"/>, <Music key="m"/>, <Trophy key="t"/>, <Palette key="p"/>, <Code key="c"/>, <BookOpen key="b"/>, <Dumbbell key="d"/>, <Globe key="g"/>];

  if (showGrid) {
    return (
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
        {eskul.map((item, index) => (
          <div
            key={item.id}
            onClick={() => onSelect?.(item)}
            className={`bg-white rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer hover:-translate-y-1 ${
              selectedId === item.id ? 'ring-2 ring-blue-500' : ''
            }`}
          >
            <div className="h-24 bg-gradient-to-r from-[#5B9BD5] to-[#2D5F7F] flex items-center justify-center text-white opacity-80 group-hover:opacity-100 transition-opacity">
              {icons[index % icons.length]}
            </div>

            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">{item.nama}</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">{item.deskripsi}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg font-medium text-gray-900 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 flex justify-between items-center transition-colors"
      >
        <span>{selectedEskul ? selectedEskul.nama : 'Pilih Ekstrakurikuler'}</span>
        <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-300 rounded-lg shadow-lg z-50">
          {loadingEskul ? (
            <div className="p-4 text-center text-gray-600">Loading...</div>
          ) : errorEskul ? (
            <div className="p-4 text-center text-red-600 text-sm">{errorEskul}</div>
          ) : eskul.length === 0 ? (
            <div className="p-4 text-center text-gray-600 text-sm">Tidak ada ekstrakurikuler</div>
          ) : (
            <ul className="max-h-64 overflow-y-auto">
              {eskul.map((item) => (
                <li
                  key={item.id}
                  onClick={() => {
                    onSelect?.(item);
                    setIsOpen(false);
                  }}
                  className={`px-4 py-3 hover:bg-blue-50 cursor-pointer border-b last:border-b-0 transition-colors ${
                    selectedId === item.id ? 'bg-blue-100 font-medium' : ''
                  }`}
                >
                  {item.nama}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default function dropdownEskul(){

    const { user, loading: loadingSession, error: sessionError } = useSession();

      const [eskul, setEskul] = useState<Eskul[]>([]);
      const [loadingEskul, setLoadingEskul] = useState(true);
      const [errorEskul, setErrorEskul] = useState<string | null>(null);
      const [jumlahEskul, setJumlahEskul] = useState(0);

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

      if (loadingSession){
        return <p>Loading your session</p>
      }

      if (loadingEskul) {
        return <p>Loading eskul...</p>;
      }

      if (errorEskul) {
        return <p>Error loading eskul: {errorEskul}</p>;
      }

      const icons = [<Users key="u"/>, <Music key="m"/>, <Trophy key="t"/>, <Palette key="p"/>, <Code key="c"/>, <BookOpen key="b"/>, <Dumbbell key="d"/>, <Globe key="g"/>];

    return(
        <div className='bg-white rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer hover:-translate-y-1'>
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
            </div>
          </div>
        ))}
        </div>
    )
}