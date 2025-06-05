package com.thjvjpxx.backend_comic.constant;

public class PaymentConstants {

    // Tỷ giá quy đổi: 1 linh thạch = 1000 VND
    public static final double VND_TO_LINHHACH_RATE = 1000.0;

    // Số linh thạch nhỏ nhất có thể nạp
    public static final double MIN_TOPUP_LINHHACH = 10.0; // 10 linh thạch = 10,000 VND

    // Số linh thạch lớn nhất có thể nạp một lần
    public static final double MAX_TOPUP_LINHHACH = 10000.0; // 10,000 linh thạch = 10,000,000 VND

    // Số tiền VND nhỏ nhất có thể nạp
    public static final double MIN_TOPUP_VND = MIN_TOPUP_LINHHACH * VND_TO_LINHHACH_RATE;

    // Số tiền VND lớn nhất có thể nạp một lần
    public static final double MAX_TOPUP_VND = MAX_TOPUP_LINHHACH * VND_TO_LINHHACH_RATE;

    // Phí rút tiền cho publisher (%)
    public static final double WITHDRAWAL_FEE_RATE = 0.05; // 5%

    // Số tiền VND nhỏ nhất có thể rút
    public static final double MIN_WITHDRAWAL_VND = 50000.0; // 50,000 VND

    // PayOS currency code
    public static final String PAYOS_CURRENCY = "VND";

    /**
     * Chuyển đổi VND sang Linh Thạch
     * 
     * @param vndAmount Số tiền VND
     * @return Số linh thạch tương ứng
     */
    public static double convertVndToLinhThach(double vndAmount) {
        return vndAmount / VND_TO_LINHHACH_RATE;
    }

    /**
     * Chuyển đổi Linh Thạch sang VND
     * 
     * @param linhThachAmount Số linh thạch
     * @return Số tiền VND tương ứng
     */
    public static double convertLinhThachToVnd(double linhThachAmount) {
        return linhThachAmount * VND_TO_LINHHACH_RATE;
    }

    /**
     * Tính phí rút tiền
     * 
     * @param amount Số tiền cần rút (VND)
     * @return Phí rút tiền (VND)
     */
    public static double calculateWithdrawalFee(double amount) {
        return amount * WITHDRAWAL_FEE_RATE;
    }

    /**
     * Tính số tiền thực nhận sau khi trừ phí rút tiền
     * 
     * @param amount Số tiền cần rút (VND)
     * @return Số tiền thực nhận (VND)
     */
    public static double calculateNetWithdrawalAmount(double amount) {
        return amount - calculateWithdrawalFee(amount);
    }
}