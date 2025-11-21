"use client";

import AdminDashboard from "./admin";
import PembinaDashboard from "./pembina";
import SiswaDashboard from "./siswa";
import ForbiddenPage from "./forbidden";
import { useSession } from '@/services/hooks/userSession';

export default function dashboard() {

  const { user, loading, error } = useSession();

  if (loading) {
    return <p>Loading session...</p>;
  }

  if (!user) {
    return <ForbiddenPage />;
  }

  if (user.role === "admin") {
    return <AdminDashboard />;
  }

  if (user.role === "pembina") {
    return <PembinaDashboard />;
  }

  if (user.role === "siswa") {
    return <SiswaDashboard />;
  }

  return <ForbiddenPage />;
}
