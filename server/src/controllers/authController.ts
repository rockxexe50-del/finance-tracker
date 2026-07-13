import type { Request, Response } from 'express';
import { UserModel } from '../models/User';
import { comparePassword, generateTokens, hashPassword } from '../services/authService';
import type { LoginInput, RegisterInput } from '../schemas/auth';

export async function register(req: Request, res: Response): Promise<void> {
  const { name, email, password } = req.body as RegisterInput;

  const exists = await UserModel.exists({ email });
  if (exists) {
    res.status(409).json({ error: 'email already registered' });
    return;
  }

  const user = await UserModel.create({
    name,
    email,
    passwordHash: await hashPassword(password),
  });

  res.status(201).json({
    user: { id: user.id, name: user.name, email: user.email },
    ...generateTokens(user.id),
  });
}

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as LoginInput;

  const user = await UserModel.findOne({ email }).select('+passwordHash');
  if (!user || !(await comparePassword(password, user.passwordHash))) {
    res.status(401).json({ error: 'invalid credentials' });
    return;
  }

  res.json({
    user: { id: user.id, name: user.name, email: user.email },
    ...generateTokens(user.id),
  });
}
