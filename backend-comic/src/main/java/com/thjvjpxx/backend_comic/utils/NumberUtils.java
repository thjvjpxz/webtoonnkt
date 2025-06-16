package com.thjvjpxx.backend_comic.utils;

/**
 * Lớp tiện ích cho các thao tác xử lý số
 */
public class NumberUtils {

    /**
     * Chuyển đổi chuỗi thành số thực double
     * 
     * @param chapterName Chuỗi cần chuyển đổi
     * @return Số thực double tương ứng
     * @throws NumberFormatException nếu chuỗi không phải là số hợp lệ
     */
    public static double parseStringToDouble(String chapterName) throws NumberFormatException {
        String normalizedName = chapterName.replace(',', '.');
        return Double.parseDouble(normalizedName);
    }
}
