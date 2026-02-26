import { getToken } from './authenticate';

const API = process.env.NEXT_PUBLIC_API_URL;

async function fetchWithAuth(url, method = 'GET') {
  const token = getToken();
  if (!token) return [];

  const res = await fetch(`${API}${url}`, {
    method,
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (res.status === 200) return res.json();
  return [];
}

export async function addToFavourites(id) {
  return fetchWithAuth(`/favourites/${id}`, 'PUT');
}

export async function removeFromFavourites(id) {
  return fetchWithAuth(`/favourites/${id}`, 'DELETE');
}

export async function getFavourites() {
  return fetchWithAuth('/favourites');
}

export async function addToHistory(id) {
  return fetchWithAuth(`/history/${id}`, 'PUT');
}

export async function removeFromHistory(id) {
  return fetchWithAuth(`/history/${id}`, 'DELETE');
}

export async function getHistory() {
  return fetchWithAuth('/history');
}
// Final version - committed as Final Commit