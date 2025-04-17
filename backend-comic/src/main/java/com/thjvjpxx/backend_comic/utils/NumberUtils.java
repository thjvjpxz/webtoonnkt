package com.thjvjpxx.backend_comic.utils;

public class NumberUtils {
    public static double parseStringToDouble(String chapterName) throws NumberFormatException {
        String normalizedName = chapterName.replace(',', '.');
        return Double.parseDouble(normalizedName);
    }
}
