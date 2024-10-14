// pages/index.tsx
import React from 'react';
import { useSession } from 'next-auth/react';
import SignIn from '../pages/auth/signin'; 

const Home = () => {
  const { data: session, status } = useSession();

  
  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  
  if (!session) {
    return <SignIn />;
  }

  
  return (
    <div>
      <h1>Bienvenue dans l/application !</h1>
      
    </div>
  );
};

export default Home;
