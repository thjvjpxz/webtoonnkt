package com.thjvjpxx.backend_comic.enums;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.experimental.FieldDefaults;

@Getter
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public enum RankEnum {
    TOP_DAY("TOP_DAY", "Top Ngày", "top-day"),
    TOP_WEEK("TOP_WEEK", "Top Tuần", "top-week"),
    TOP_MONTH("TOP_MONTH", "Top Tháng", "top-month"),
    FAVORITE("FAVORITE", "Yêu Thích", "favorite"),
    LAST_UPDATE("LAST_UPDATE", "Mới Cập Nhật", "last-update"),
    NEW("NEW", "Truyện Mới", "new"),
    FULL("FULL", "Truyện Full", "full"),
    RANDOM("RANDOM", "Truyện Ngẫu Nhiên", "random");

    String code;
    String name;
    String slug;
}
