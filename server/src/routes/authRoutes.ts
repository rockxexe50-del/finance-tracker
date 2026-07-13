import { Router } from 'express';
import { login, register } from '../controllers/authController';
import { validate } from '../middleware/validate';
import { loginSchema, registerSchema } from '../schemas/auth';

export const authRoutes = Router();

authRoutes.post('/register', validate(registerSchema), register);
authRoutes.post('/login', validate(loginSchema), login);
