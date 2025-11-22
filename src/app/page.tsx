'use client'

import Login from "./login/page";
import { useSession } from '@/services/hooks/userSession';

export default function Home() {

  const { user, loading: loadingSession, error: sessionError } = useSession();

  if (!user) {
      return <Login />;
    }
}
