import { Schema, model, type HydratedDocument, type InferSchemaType } from 'mongoose';

const transactionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['income', 'expense'], required: true },
    amount: { type: Number, required: true, min: 0.01 },
    category: { type: String, required: true, trim: true },
    date: { type: Date, required: true, default: Date.now },
    description: { type: String, trim: true, default: '' },
  },
  { timestamps: true },
);

// listing is always per-user, newest first
transactionSchema.index({ userId: 1, date: -1 });

export type Transaction = InferSchemaType<typeof transactionSchema>;
export type TransactionDocument = HydratedDocument<Transaction>;

export const TransactionModel = model('Transaction', transactionSchema);
