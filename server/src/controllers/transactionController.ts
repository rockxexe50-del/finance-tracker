import type { Request, Response } from 'express';
import { TransactionModel } from '../models/Transaction';
import type { CreateTransactionInput, UpdateTransactionInput } from '../schemas/transaction';

export async function listTransactions(req: Request, res: Response): Promise<void> {
  const transactions = await TransactionModel.find({ userId: req.userId }).sort({ date: -1 });
  res.json({ transactions });
}

export async function createTransaction(req: Request, res: Response): Promise<void> {
  const input = req.body as CreateTransactionInput;
  const transaction = await TransactionModel.create({ ...input, userId: req.userId });
  res.status(201).json({ transaction });
}

export async function getTransaction(req: Request, res: Response): Promise<void> {
  const transaction = await TransactionModel.findOne({ _id: req.params.id, userId: req.userId });
  if (!transaction) {
    res.status(404).json({ error: 'transaction not found' });
    return;
  }
  res.json({ transaction });
}

export async function updateTransaction(req: Request, res: Response): Promise<void> {
  const input = req.body as UpdateTransactionInput;
  const transaction = await TransactionModel.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    input,
    { new: true, runValidators: true },
  );
  if (!transaction) {
    res.status(404).json({ error: 'transaction not found' });
    return;
  }
  res.json({ transaction });
}

export async function deleteTransaction(req: Request, res: Response): Promise<void> {
  const deleted = await TransactionModel.findOneAndDelete({ _id: req.params.id, userId: req.userId });
  if (!deleted) {
    res.status(404).json({ error: 'transaction not found' });
    return;
  }
  res.status(204).end();
}
