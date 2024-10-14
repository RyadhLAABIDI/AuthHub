// pages/api/update.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { updateUserById, getUserById } from '../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { userId, address, dateOfBirth, name, phoneNumber, surname } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'ID utilisateur manquant' });
  }

  try {
    const user = await getUserById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Vérifier si l'adresse a été validée
    if (!user.addressValidated) {
      return res.status(403).json({ message: 'Adresse non validée. Veuillez valider votre adresse avant de mettre à jour le profil.' });
    }

    // Préparer les données de mise à jour
    const updateData: Partial<typeof user> = {
      name,
      surname,
      phoneNumber,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      address,
    };

    const result = await updateUserById(userId, updateData);

    if (result) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json({ message: 'Échec de la mise à jour de l\'utilisateur' });
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
    return res.status(500).json({ message: 'Erreur interne du serveur' });
  }
}
