import { Request, Response } from 'express';
import * as UserModel from '../models/user.model';

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const user = await UserModel.findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (user.password !== password) { // In production, use bcrypt
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // For simplicity, returning user details. In real app, use JWT.
        const { password: _, ...userWithoutPassword } = user;
        res.json({ message: 'Login successful', user: userWithoutPassword });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
};

export const register = async (req: Request, res: Response) => {
    const { name, role, contact_info, password } = req.body;
    if (!name || !role || !contact_info || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    try {
        const existingUser = await UserModel.findUserByEmail(contact_info);
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }

        const userId = await UserModel.createUser({ name, role, contact_info, password });
        res.status(201).json({ message: 'User created successfully', userId });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
};

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await UserModel.getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
};
