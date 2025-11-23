'use client'

import { redirect } from 'next/navigation'
import { useSession } from '@/services/hooks/userSession';

export default function Home() {
  const { user, loading: loadingSession } = useSession();

  // if (loadingSession) {
  //   return <div>Loading...</div>;
  // }

  if (!user) {
    redirect(`/login`)
  }
}
