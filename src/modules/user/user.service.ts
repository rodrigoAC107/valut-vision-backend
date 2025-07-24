import bcrypt from 'bcryptjs';

import { User } from "./user.model";

export const me = async (email: string) => {
    const userData = await User.findOne({ email });

    if (!userData) throw new Error('User not found');

    return userData;
};

export const updatePassword = async (
    email: string,
    password: string,
    newPassword: string,
    confirmPassword: string
) => {
    if (newPassword !== confirmPassword) {
        throw new Error('New password and confirmation do not match');
    }

    const user = await User.findOne({ email });
    if (!user) throw new Error('User not found');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Current password incorrect');

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    return user;
};
