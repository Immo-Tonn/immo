// immo/BE/src/models/AdminModel.ts
import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IAdmin extends Document {
  email: string;
  fullName: string;
  username: string;
  password: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const AdminSchema: Schema = new Schema({
  email: {
    type: String,
    required: [true, 'E-Mail ist erforderlich'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  fullName: {
    type: String,
    required: [true, 'Vor- und Nachname sind erforderlich'],
    trim: true,
  },
  username: {
    type: String,
    required: [true, 'Benutzername ist erforderlich'],
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Passwort erforderlich'],
    minlength: [8, 'Das Passwort muss mindestens 8 Zeichen lang sein'],
  },
});

// Hashing the password before saving
AdminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    // Explicit type casting to solve the typing problem
    const passwordToHash = this.password as string;
    const hashedPassword = await bcrypt.hash(passwordToHash, salt);
    this.password = hashedPassword;
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method for comparing passwords
AdminSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  const hashedPassword = this.password as string; // Явное приведение типа
  return bcrypt.compare(candidatePassword, hashedPassword);
};

export const AdminModel = mongoose.model<IAdmin>(
  'Admin',
  AdminSchema,
  'admins',
);
