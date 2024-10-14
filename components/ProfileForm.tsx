import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { User } from '../types/index';
import React from 'react';
import { useRouter } from 'next/router';

interface ProfileFormProps {
  user: User;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ user }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [address] = useState<string>(user.address || ''); 
  const [dateOfBirth, setDateOfBirth] = useState<string>(user.dateOfBirth ? user.dateOfBirth.toISOString().split('T')[0] : '');
  const [name, setName] = useState<string>(user.name || '');
  const [phoneNumber, setPhoneNumber] = useState<string>(user.phoneNumber || '');
  const [surname, setSurname] = useState<string>(user.surname || '');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [addressValidated, setAddressValidated] = useState<boolean>(user.addressValidated || false);

  const handleUpdateUser = async () => {
    try {
      if (!addressValidated) {
        router.push('/validate-address');
        return;
      }

      const response = await fetch('/api/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session?.user.id,
          dateOfBirth,
          name,
          phoneNumber,
          surname,
        }),
      });

      if (!response.ok) {
        const errorMessage = await response.json();
        setError(`Erreur lors de la mise à jour de l'utilisateur: ${errorMessage.message || 'Erreur inconnue'}`);
      } else {
        const updatedUser = await response.json();
        setSuccess('Utilisateur mis à jour avec succès');
        console.log('Utilisateur mis à jour:', updatedUser);
      }
    } catch (error) {
      setError('Erreur lors de la mise à jour de l\'utilisateur');
      console.error('Error updating user:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleUpdateUser();
  };

  useEffect(() => {
    setDateOfBirth(user.dateOfBirth ? user.dateOfBirth.toISOString().split('T')[0] : '');
    setName(user.name || '');
    setPhoneNumber(user.phoneNumber || '');
    setSurname(user.surname || '');
    setAddressValidated(user.addressValidated || false);
  }, [user]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-8 bg-white shadow-lg rounded-lg transition-transform duration-300 hover:shadow-xl">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">Modifier votre Profil</h2>
      <div>
        <label className="block text-sm font-medium text-gray-700">Prénom:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out transform hover:scale-105"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Nom:</label>
        <input
          type="text"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out transform hover:scale-105"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Date de Naissance:</label>
        <input
          type="date"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out transform hover:scale-105"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Adresse:</label>
        <input
          type="text"
          value={address}
          disabled 
          className="mt-1 block w-full border border-gray-300 bg-gray-200 rounded-md p-2 cursor-not-allowed" // Couleur de fond et curseur non modifiable
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Numéro de Téléphone:</label>
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out transform hover:scale-105"
        />
      </div>
      <button
        type="submit"
        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-md text-sm font-medium text-white ${addressValidated ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out'}`}
        disabled={!addressValidated}
      >
        Mettre à jour l/utilisateur
      </button>
      {error && <p className="text-red-500 text-center">{error}</p>}
      {success && <p className="text-green-500 text-center">{success}</p>}
    </form>
  );
};

export default ProfileForm;
