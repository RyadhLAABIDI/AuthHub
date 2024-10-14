import mongoose, { Document, Model } from 'mongoose';


interface UserDocument extends Document {
  address: string;
  dateOfBirth: Date; 
  phoneNumber: string;
  surname?: string; 
  firstName?: string; 
}

// Define the User interface for general use
export interface User {
  id: string; // Keep the ID here
  address: string | null;
  dateOfBirth: Date | null; 
  phoneNumber: string | null;
  surname: string | null;
  name?: string | null;
  email?: string | null; 
  addressValidated?: boolean;
  
}

// Define the UserModel interface that extends mongoose.Model
interface UserModel extends Model<UserDocument> {
  updateUser(id: string, updateData: Partial<UserDocument>): Promise<UserDocument | null>;
}

// Define the user schema
const userSchema = new mongoose.Schema({
  address: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  firstName: { type: String, required: false },
  phoneNumber: { type: String, required: true },
  surname: { type: String, required: false }, 
});

// Implementation of the updateUser method
userSchema.statics.updateUser = async function (id: string, updateData: Partial<UserDocument>) {
  
  const updatedUser = await this.findByIdAndUpdate(id, updateData, { new: true });

 
  if (!updatedUser) {
    throw new Error("User not found");
  }

  return updatedUser as UserDocument;
};


const User = mongoose.models.User || mongoose.model<UserDocument, UserModel>('User', userSchema);


export default User;
