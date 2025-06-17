import '@/app/globals.css';
import StarsCanvas from '@/components/StarsCanvas';
import type { AppProps } from 'next/app';


export default function App({ Component, pageProps }: AppProps) {

  return (
    <>
    <StarsCanvas/>
    <Component {...pageProps} />
    </>
  );
} 