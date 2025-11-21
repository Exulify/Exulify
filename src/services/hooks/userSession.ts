'use client';
import { useEffect, useState } from 'react';

type SessionUser = {
  id?: number;
  role?: string;
  nama?: string;
  username?: string;
  [k: string]: any;
};

type SessionResponse = {
  success: boolean;
  data: SessionUser | null;
  message?: string;
};

export function useSession() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

    const fetchSession = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${base}/api/auth/session`, {
          credentials: 'include',
          headers: { Accept: 'application/json' }
        });

        const json: SessionResponse = await res.json();

        if (!mounted) return;
        if (res.ok && json.success) {
          setUser(json.data);
          setError(null);
        } else {
          setUser(null);
          setError(json.message || `Status ${res.status}`);
        }
      } catch (e: any) {
        if (!mounted) return;
        setUser(null);
        setError(e?.message || 'Network error');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchSession();

    return () => {
      mounted = false;
    };
  }, []);

  return { user, loading, error };
}

export function endSession(){
  const [user, setUser] = useState<SessionUser | null>(null)
}