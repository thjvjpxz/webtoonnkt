export interface PopupResponse {
  paymentLink: string;
}

export interface TransactionResponse {
  id: string;
  transactionCode: number;
  amount: number;
  payosAmountVnd: number;
  status: string;
  description: string;
  paymentMethod: string; // BALANCE, PayOS
  durationDays: number;

  userId: string;
  username: string;

  updatedAt: string;
}

export interface TransactionStatsResponse {
  totalTransactions: number;
  totalAmount: number;
  paidCount: number;
  pendingCount: number;
}