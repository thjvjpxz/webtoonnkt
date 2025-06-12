export interface PopupResponse {
  paymentLink: string;
}

export interface TransactionResponse {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}