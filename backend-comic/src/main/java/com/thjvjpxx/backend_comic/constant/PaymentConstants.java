package com.thjvjpxx.backend_comic.constant;

/**
 * Constants cho thanh toán
 */
public class PaymentConstants {

    // Tỷ giá quy đổi: 1 linh thạch = 1000 VND
    public static final double VND_TO_LINHHACH_RATE = 1000.0;

    // Số linh thạch nhỏ nhất có thể nạp
    public static final double MIN_TOPUP_LINHHACH = 2.0; // 2 linh thạch = 2,000 VND

    // Số linh thạch lớn nhất có thể nạp một lần
    public static final double MAX_TOPUP_LINHHACH = 10000.0; // 10,000 linh thạch = 10,000,000 VND

    // Số tiền VND nhỏ nhất có thể nạp
    public static final double MIN_TOPUP_VND = MIN_TOPUP_LINHHACH * VND_TO_LINHHACH_RATE;

    // Số tiền VND lớn nhất có thể nạp một lần
    public static final double MAX_TOPUP_VND = MAX_TOPUP_LINHHACH * VND_TO_LINHHACH_RATE;

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
}