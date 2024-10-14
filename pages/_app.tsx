// pages/_app.tsx
import React from 'react';
import { SessionProvider, useSession } from 'next-auth/react';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router'; 
import '../styles/globals.css'; 
import Header from '../components/Header';

interface AppPropsWithRouter extends AppProps {
  router: any; 
}

const AppWrapper: React.FC<AppPropsWithRouter> = ({ Component, pageProps }) => {
  const { data: session, status } = useSession();
  const router = useRouter(); 

  
  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  // Si l'utilisateur n'est pas connecté, n'affiche pas l'en-tête
  const showHeader = !!session;

  return (
    <>
      {showHeader && <Header />}
      <Component {...pageProps} router={router} /> 
    </>
  );
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <AppWrapper Component={Component} pageProps={pageProps} router={useRouter()} />
    </SessionProvider>
  );
}
