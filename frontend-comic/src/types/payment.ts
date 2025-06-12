export interface PopupResponse {
  paymentLink: string;
}

export interface TransactionResponse {
  id: string;
  transactionCode: number;
  amount: number;
  status: string;
  description: string;
  updatedAt: string;
}