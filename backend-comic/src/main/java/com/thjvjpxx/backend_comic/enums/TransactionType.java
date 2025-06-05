package com.thjvjpxx.backend_comic.enums;

public enum TransactionType {
    TOPUP, // Nạp linh thạch vào tài khoản (10.000 VND = 10 linh thạch)
    PURCHASE, // Mua chapter bằng linh thạch
    WITHDRAWAL // Rút tiền (dành cho publisher)
}