package com.thjvjpxx.backend_comic.utils;

public class string {
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
}
