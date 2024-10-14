"use client";
import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import ProfileForm from '../components/ProfileForm';
import { User } from '../types/index';
import { useRouter } from 'next/router';

const Profile = () => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') {
      return; 
    }

    if (status === 'unauthenticated') {
      router.push('/auth/signin'); 
    }

    if (status === 'authenticated') {
      // Fetch user data from API
      fetch('/api/user')
        .then((res) => {
          if (!res.ok) {
            throw new Error('Échec de récupération des données utilisateur');
          }
          return res.json();
        })
        .then((data: User) => {
          setUser({
            id: data.id,
            name: data.name || null,
            email: data.email || null,
            address: data.address || '',
            surname: data.surname || '',
            dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
            phoneNumber: data.phoneNumber || '',
            addressValidated: data.addressValidated || false,
          });
          setLoading(false);

          // Si l'adresse n'est pas validée, rediriger vers la page de saisie de l'adresse
          if (!data.addressValidated) {
            router.push('/validate-address');
          }
        })
        .catch((err) => {
          console.error('Erreur lors de la récupération des données utilisateur:', err);
          setError('Échec du chargement des données utilisateur');
          setLoading(false);
        });
    }
  }, [status, router]);

  if (loading) {
    return <p>Chargement...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold">Éditer le Profil</h1>
      <p>Connecté en tant que {session?.user?.email}</p>
      <ProfileForm user={user} />
      <button
        onClick={() => signOut()}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded"
      >
        Se Déconnecter
      </button>
    </div>
  );
};

export default Profile;
