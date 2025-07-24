import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { User } from '../user/user.model';

const JWT_SECRET = process.env.JWT_SECRET || 'pass-super-secret';

export const registerUser = async (email: string, password: string, name: string) => {
    const existingUser = await User.findOne({ email });

    if (existingUser) throw new Error('Email already registered');

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
        email,
        password: hashedPassword,
        name,
    });

    await newUser.save();
    return newUser;
};

export const loginUser = async (email: string, password: string) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error('User not found');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Password incorrect');

    const token = jwt.sign(
        { userId: user._id, email: user.email },
        JWT_SECRET,
        { expiresIn: '1d' }
    );

    const userObj = user.toObject() as Partial<typeof user>;
    delete userObj.password;
    delete userObj.__v;

    return { token, user: userObj };
};