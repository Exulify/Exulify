"use client";
import Sidebar from '../components/Sidebar';
import { useSession } from '@/services/hooks/userSession';

export default function PembinaDashboard() {

  const { user, loading: loadingSession, error: sessionError } = useSession();

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
        </div>
      </main>
    </div>
  );
}
