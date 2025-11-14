'use client';
import * as React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async () => {
    if (!form.username || !form.password) {
      setError('Email dan Password wajib diisi.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const res = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          username: form.username,
          password: form.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login gagal.');

      router.push('/home');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#5B9BD5] via-[#4A8BC2] to-[#2D5F7F] flex items-center justify-center p-4">
      <div className="bg-gradient-to-b from-gray-100 to-gray-200 rounded-3xl shadow-2xl p-10 w-full max-w-md">
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-gray-900">STARBHAK</h1>
          <h2 className="text-2xl font-normal text-gray-900">Extracurricular Portal</h2>
        </div>

        <div className="space-y-3">
          <div>
            <input
              type="email"
              placeholder="Email"
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full px-5 py-3.5 bg-white border-0 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm text-sm"
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-5 py-3.5 bg-white border-0 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm text-sm"
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => router.push('/register')}
              className="text-xs text-blue-600 hover:text-blue-700 transition-colors"
            >
              Doesn't have an account?
            </button>
          </div>

          <button
            type="button"
            onClick={handleLogin}
            disabled={loading}
            className={`w-full py-3.5 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl text-base mt-16 ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#2D5F7F] to-[#1F4A61] text-white hover:from-[#234A5E] hover:to-[#183A4A]'
            }`}
          >
            {loading ? 'Loading...' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
}
