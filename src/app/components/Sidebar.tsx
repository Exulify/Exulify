import { Home, TrendingUp, Settings, LogOut } from 'lucide-react';

export default function Sidebar(){

    const handleLogout = async () => {
    try {
        const res = await fetch('http://localhost:3000/api/auth/logout', {
        method: 'GET',
        credentials: 'include'
        });

        if (res.ok) {
        window.location.href = '/login';
        }
    } catch (err) {
        console.error(err);
    }
    };


    return (
        <div className="w-48 bg-gradient-to-b from-[#5B9BD5] to-[#2D5F7F] text-white flex flex-col p-8 rounded-r-3xl">
            <div className="mb-12">
            <p className="text-xl font-semibold mt-2 text-center">Exulify</p>
            </div>

            <nav className="flex-1 space-y-4">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-full font-medium bg-blue-400 bg-opacity-25 backdrop-blur">
                <TrendingUp className="w-10 h-10" />
                Dashboard
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-full font-medium hover:bg-white hover:bg-opacity-10 transition-all">
                <Home className="w-5 h-5" />
                Home
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-full font-medium hover:bg-white hover:bg-opacity-10 transition-all">
                <Settings className="w-5 h-5" />
                Settings
            </button>
            </nav>

            <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500 hover:bg-red-600 rounded-full font-medium transition-colors">
            <LogOut className="w-5 h-5" />
            Sign Out
            </button>
        </div>
    )
}