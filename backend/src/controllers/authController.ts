import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Student from '../models/Student';
import Company from '../models/Company';

const generateToken = (id: string, role: string, email: string) =>
  jwt.sign({ id, role, email }, process.env.JWT_SECRET || 'internship_secret_key', { expiresIn: '7d' });

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role, companyName, industry } = req.body;
    const existing = await User.findOne({ email });
    if (existing) { res.status(400).json({ success: false, message: 'Email already registered' }); return; }

    const user = await User.create({ name, email, password, role, status: role === 'recruiter' ? 'pending' : 'active' });

    if (role === 'student') {
      await Student.create({ userId: user._id });
    } else if (role === 'recruiter') {
      await Company.create({ userId: user._id, companyName: companyName || name, industry: industry || 'Technology', isApproved: false });
    }

    const token = generateToken(String(user._id), user.role, user.email);
    res.status(201).json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, role: user.role, status: user.status } });
  } catch (err: unknown) {
    res.status(500).json({ success: false, message: (err as Error).message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json({ success: false, message: 'Invalid email or password' }); return;
    }
    const token = generateToken(String(user._id), user.role, user.email);
    res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, role: user.role, status: user.status } });
  } catch (err: unknown) {
    res.status(500).json({ success: false, message: (err as Error).message });
  }
};

export const getMe = async (req: Request & { user?: { id: string } }, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id).select('-password');
    res.json({ success: true, user });
  } catch (err: unknown) {
    res.status(500).json({ success: false, message: (err as Error).message });
  }
};
