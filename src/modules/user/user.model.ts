// models/user.model.ts
import { Schema, model, Document } from 'mongoose';

export interface UserInput {
    email: string;
    password: string;
    name: string;
}

export interface UserDocument extends UserInput, Document { }

const userSchema = new Schema<UserDocument>({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Encriptada
    name: { type: String, required: true },
});

export const User = model<UserDocument>('User', userSchema);
