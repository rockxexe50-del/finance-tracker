import { Router } from 'express';
import {
  createTransaction,
  deleteTransaction,
  getTransaction,
  listTransactions,
  updateTransaction,
} from '../controllers/transactionController';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createTransactionSchema, updateTransactionSchema } from '../schemas/transaction';

export const transactionRoutes = Router();

transactionRoutes.use(requireAuth);

transactionRoutes.get('/', listTransactions);
transactionRoutes.post('/', validate(createTransactionSchema), createTransaction);
transactionRoutes.get('/:id', getTransaction);
transactionRoutes.patch('/:id', validate(updateTransactionSchema), updateTransaction);
transactionRoutes.delete('/:id', deleteTransaction);
