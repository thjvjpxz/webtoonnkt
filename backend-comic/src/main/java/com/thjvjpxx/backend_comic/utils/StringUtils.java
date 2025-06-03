package com.thjvjpxx.backend_comic.utils;

import java.text.Normalizer;
import java.util.UUID;
import java.util.regex.Pattern;

public class StringUtils {
    public static String getIdFromUrl(String url) {
        if (url == null || url.isEmpty()) {
            return null;
        }

        String[] parts = url.split("/d/");
        if (parts.length < 2) {
            return null;
        }

        return parts[1];
    }

    public static String generateSlug(String input) {
        if (input == null || input.isEmpty()) {
            return null;
        }

        String result = input.toLowerCase();

        result = Normalizer.normalize(result, Normalizer.Form.NFD);
        result = Pattern.compile("\\p{InCombiningDiacriticalMarks}+").matcher(result).replaceAll("");

        result = result.replace("đ", "d");

        result = result.replaceAll("[^a-z0-9]", "-");

        result = Pattern.compile("-+").matcher(result).replaceAll("-");

        result = result.replaceAll("^-|-$", "");

        return result;
    }

    public static String generateVerificationToken() {
        return UUID.randomUUID().toString();
    }
}
