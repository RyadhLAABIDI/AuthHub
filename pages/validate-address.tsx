import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const ValidateAddress = () => {
  const { data: session, status } = useSession();
  const [address, setAddress] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') {
      return;
    }

    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!address) {
      setError('Veuillez entrer une adresse.');
      return;
    }

    try {
      const response = await fetch('/api/validate-address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session?.user.id,
          address,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || 'Erreur lors de la validation de l\'adresse');
        return;
      } else {
        setSuccess(result.message);
        setError(null);
        router.push('/');
      }
    } catch (err) {
      setError('Erreur lors de la validation de l\'adresse');
      console.error('Erreur:', err);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4 text-center text-blue-600">Valider votre Adresse</h1>
      <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white shadow-lg rounded-lg transition-transform duration-300 hover:shadow-xl">
        <div>
          <label className="block text-sm font-medium text-gray-700">Adresse:</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out transform hover:scale-105"
          />
          <p className="text-sm text-gray-500">Veuillez entrer une adresse située à moins de 50 km de Paris.</p>
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
        >
          Valider l/adresse
        </button>
        {error && <p className="text-red-500 text-center">{error}</p>}
        {success && <p className="text-green-500 text-center">{success}</p>}
      </form>
    </div>
  );
};

export default ValidateAddress;
