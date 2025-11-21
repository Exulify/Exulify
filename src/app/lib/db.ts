const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export async function apiFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    let errorBody: any = {};
    try {
      errorBody = await res.json();
    } catch (_) {}

    throw new Error(errorBody.message || res.statusText);
  }
  return res.json() as any;
}
