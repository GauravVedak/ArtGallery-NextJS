import '@/styles/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { SWRConfig } from 'swr';
import Layout from '@/components/Layout';
import RouteGuard from '@/components/RouteGuard';

export default function App({ Component, pageProps }) {
  return (
    <SWRConfig value={{
      fetcher: async url => {
        const res = await fetch(url);
        if (!res.ok) {
          const error = new Error('An error occurred while fetching the data.');
          error.info = await res.json();
          error.status = res.status;
          throw error;
        }
        return res.json();
      }
    }}>
      <RouteGuard>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </RouteGuard>
    </SWRConfig>
  );
}
// Final version - committed as Final Commit