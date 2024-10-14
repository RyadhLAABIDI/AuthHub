"use client";
import React from 'react';
import { signIn } from 'next-auth/react';
import { useState } from 'react';

const SignIn = () => {
  const [email, setEmail] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn('github', { callbackUrl: '/Profile' });
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-blue-300">
      <form onSubmit={handleSignIn} className="p-6 bg-white rounded-lg shadow-lg transition-transform duration-300 hover:shadow-xl">
        <h2 className="mb-4 text-xl font-bold text-center text-blue-600">Sign In</h2>
        
        {/* Message de bienvenue */}
        <p className="mb-4 text-center text-gray-700">
          Bienvenue dans notre application ! Veuillez vous connecter pour continuer.
        </p>

        <button
          type="submit"
          className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Sign in with GitHub
        </button>
      </form>
    </div>
  );
};

export default SignIn;
