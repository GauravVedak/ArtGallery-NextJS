import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { readToken } from '@/lib/authenticate';
import { useAtom } from 'jotai';
import { favouritesAtom, searchHistoryAtom } from '@/store';
import { getFavourites, getHistory } from '@/lib/userData';

const PUBLIC_PATHS = ['/login', '/register'];

export default function RouteGuard({ children }) {
  const router = useRouter();
  const [favourites, setFavourites] = useAtom(favouritesAtom);
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);

  async function updateAtoms() {
    const token = readToken();
    if (token) {
      try {
        const favs = await getFavourites();
        const history = await getHistory();
        setFavourites(favs);
        setSearchHistory(history);
      } catch (err) {
        console.error("Failed to load user data:", err);
      }
    }
  }

  useEffect(() => {
    const pathIsPublic = PUBLIC_PATHS.includes(router.pathname);
    const token = readToken();

    updateAtoms();

    if (!token && !pathIsPublic) {
      router.push('/login');
    }
  }, [router.pathname]);

  return children;
}