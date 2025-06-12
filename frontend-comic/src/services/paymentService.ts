import { PopupResponse, TransactionResponse } from "@/types/payment";
import { fetchApi } from "./api";

export const createPaymentLink = async (amount: number) => {
  const endpoint = `/transactions/topup`;

  return await fetchApi<PopupResponse>(endpoint, {
    method: "POST",
    data: { amount },
  });
}

export const getTransactionByOrderCode = async (orderCode: string) => {
  const endpoint = `/transactions/status/${orderCode}`;

  return await fetchApi<TransactionResponse>(endpoint);
}

export const cancelTransaction = async (orderCode: string) => {
  const endpoint = `/transactions/cancel/${orderCode}`;

  return await fetchApi<TransactionResponse>(endpoint, {
    method: "PUT",
  });
}

export const getMyTransactions = async (page: number, limit: number) => {
  const endpoint = `/transactions/me?page=${page}&limit=${limit}`;

  return await fetchApi<TransactionResponse[]>(endpoint);
}