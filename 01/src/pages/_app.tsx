import '@/app/globals.css';
import StarsCanvas from '@/components/StarsCanvas';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import LoadingScreen from '@/components/LoadingScreen';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    // Handle initial page load
    setPageLoading(false);

    // Handle route changes
    const handleStart = () => {
      setLoading(true);
    };
    const handleComplete = () => {
      setLoading(false);
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  if (pageLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <StarsCanvas />
      {loading && <LoadingScreen />}
      <div className={`transition-all duration-500 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        <Component {...pageProps} />
      </div>
    </>
  );
} 