import { Request, Response } from 'express';

import * as authService from './auth.service';

export const register = async (req: Request, res: Response) => {

    const { email, password, name } = req.body;

    try {
        const user = await authService.registerUser(email, password, name);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ message: 'Registration failed', error });
    }

};

export const login = async (req: Request, res: Response) => {

    const { email, password } = req.body;

    try {
        const user = await authService.loginUser(email, password);
        res.json(user);
    } catch (error) {
        res.status(400).json({ message: 'Login failed', error });
    }
};