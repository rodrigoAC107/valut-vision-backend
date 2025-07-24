import { Request, Response } from 'express';

import * as userService from './user.service';

export const me = async (req: Request, res: Response) => {

    const { email } = req.body;

    try {
        const user = await userService.me(email);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ message: 'Get user data failed', error });
    }
};


export const changePassword = async (req: Request, res: Response) => {

    const { email, password, newPassword, confirmPassword } = req.body;

    try {
        const user = await userService.updatePassword(email, password, newPassword, confirmPassword);
        res.status(201).json({ message: 'Password changed successfully', user });
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Unexpected server error' });
        }
    }
};