import type { NextApiRequest, NextApiResponse } from 'next';
import { getUserById, updateUserById } from '../../lib/db';

const PARIS_COORDS = { lat: 48.8566, lon: 2.3522 };

// Fonction pour calculer la distance entre deux points en km
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Rayon de la Terre en km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { userId, address } = req.body;

  if (!userId || !address) {
    return res.status(400).json({ message: 'Paramètres manquants' });
  }

  try {
    
    const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(address)}`);
    const data = await response.json();

    if (data.features.length === 0) {
      return res.status(400).json({ message: 'Adresse non trouvée' });
    }

    const { coordinates } = data.features[0].geometry;
    const [lon, lat] = coordinates;

    // Calcul de la distance par rapport à Paris
    const distance = calculateDistance(lat, lon, PARIS_COORDS.lat, PARIS_COORDS.lon);

    // Modifiez la condition de distance ici
    if (distance > 50) { // Changement de 2000 km à 50 km
      return res.status(400).json({ message: 'L\'adresse doit être située à moins de 50 km de Paris' });
    }

    
    await updateUserById(userId, {
      address,
      addressValidated: true,
    });

    return res.status(200).json({ message: 'Adresse validée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la validation de l\'adresse:', error);
    return res.status(500).json({ message: 'Erreur interne du serveur' });
  }
}
