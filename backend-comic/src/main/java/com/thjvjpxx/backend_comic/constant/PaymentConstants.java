package com.thjvjpxx.backend_comic.constant;

/**
 * Constants cho thanh toán
 */
public class PaymentConstants {

    public static final double VND_TO_LINHHACH_RATE = 1000.0;

    public static final double MIN_TOPUP_LINHHACH = 2.0;

    public static final double MAX_TOPUP_LINHHACH = 1000.0;

    public static final double MIN_TOPUP_VND = MIN_TOPUP_LINHHACH * VND_TO_LINHHACH_RATE;

    public static final double MAX_TOPUP_VND = MAX_TOPUP_LINHHACH * VND_TO_LINHHACH_RATE;

    public static final String PAYOS_CURRENCY = "VND";

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