// lib/db.ts

import { MongoClient, Document, WithId, ObjectId } from 'mongodb';

// MongoDB URI
const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/AppAuth";
let client: MongoClient | null = null;

// Interface for User Data
export interface UserData {
  _id: ObjectId;
  name?: string | null;
  email?: string;
  address?: string | null;
  surname?: string | null;
  dateOfBirth?: Date | null;
  phoneNumber?: string | null;
  addressValidated?: boolean;
}

// Connect to MongoDB
export async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(uri);
    try {
      await client.connect();
      console.log('Connexion à MongoDB réussie !');
    } catch (error) {
      console.error('Échec de la connexion à MongoDB :', error);
      throw error;
    }
  }
  return client.db();
}

// Function to retrieve a user by email
export const getUserFromDatabase = async (email: string): Promise<UserData | null> => {
  const db = await connectToDatabase();
  console.log('Recherche de l\'utilisateur avec l\'email:', email);
  const user = await db.collection('users').findOne({ email }) as WithId<Document> | null;

  if (user) {
    console.log('Utilisateur trouvé:', user);
    const userData: UserData = {
      _id: user._id as ObjectId,
      name: user.name || null,
      email: user.email || null,
      address: user.address || null,
      surname: user.surname || null,
      dateOfBirth: user.dateOfBirth || null,
      phoneNumber: user.phoneNumber || null,
      addressValidated: user.addressValidated || false,
    };
    return userData;
  } else {
    console.log('Aucun utilisateur trouvé avec l\'email fourni.');
    return null;
  }
};

// Function to retrieve a user by ID
export const getUserById = async (id: string): Promise<UserData | null> => {
  const db = await connectToDatabase();
  console.log('Recherche de l\'utilisateur avec l\'ID:', id);
  const user = await db.collection('users').findOne({ _id: new ObjectId(id) }) as WithId<Document> | null;

  if (user) {
    console.log('Utilisateur trouvé:', user);
    const userData: UserData = {
      _id: user._id as ObjectId,
      name: user.name || null,
      email: user.email || null,
      address: user.address || null,
      surname: user.surname || null,
      dateOfBirth: user.dateOfBirth || null,
      phoneNumber: user.phoneNumber || null,
      addressValidated: user.addressValidated || false,
    };
    return userData;
  } else {
    console.log('Aucun utilisateur trouvé avec l\'ID fourni.');
    return null;
  }
};

// Function to create a new user in the database
export const createUserInDatabase = async (email: string, name: string): Promise<void> => {
  const db = await connectToDatabase();
  console.log('Création d\'un nouvel utilisateur:', { email, name });

  const result = await db.collection('users').insertOne({
    email,
    name,
    createdAt: new Date(),
    addressValidated: false, // Par défaut, non validée
  });

  console.log('Nouvel utilisateur créé avec l\'ID:', result.insertedId);
};

// Function to update a user by ID
export async function updateUserById(userId: string, data: Partial<UserData>) {
  const db = await connectToDatabase();
  console.log('ID de l\'utilisateur à mettre à jour:', userId);
  console.log('Données de mise à jour:', data);

  try {
    if (!userId) {
      throw new Error('L\'ID de l\'utilisateur est manquant.');
    }

    if (!data || typeof data !== 'object') {
      throw new Error('Les données de mise à jour doivent être un objet valide.');
    }

    // Filtrer les champs indéfinis
    const filteredData = Object.keys(data).reduce((acc, key) => {
      const value = data[key as keyof UserData];
      if (value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {} as Partial<UserData>);

    if (Object.keys(filteredData).length === 0) {
      throw new Error('Aucune donnée valide à mettre à jour.');
    }

    console.log('Filtres de mise à jour:', filteredData);

    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { $set: filteredData }
    );

    console.log('Résultat de la mise à jour:', result);

    if (result.matchedCount === 0) {
      throw new Error('Utilisateur non trouvé.');
    }

    console.log('Mise à jour réussie pour l\'utilisateur avec ID:', userId);
    return result;
  } catch (error: any) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
    throw error;
  }
}
