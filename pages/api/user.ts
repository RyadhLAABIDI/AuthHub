// pages/api/user.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { getUserById } from '../../lib/db';
import { getToken } from 'next-auth/jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Obtenir le token de session
  const token = await getToken({ req });
  
  if (!token || !token.id) {
    return res.status(401).json({ message: 'Non autorisé' });
  }

  const userId = token.id;

  try {
    const user = await getUserById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

   
    return res.status(200).json({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      address: user.address,
      surname: user.surname,
      dateOfBirth: user.dateOfBirth,
      phoneNumber: user.phoneNumber,
      addressValidated: user.addressValidated || false,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des données utilisateur:', error);
    return res.status(500).json({ message: 'Erreur interne du serveur' });
  }
}
