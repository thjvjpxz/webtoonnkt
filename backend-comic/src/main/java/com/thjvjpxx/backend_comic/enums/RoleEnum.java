package com.thjvjpxx.backend_comic.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum RoleEnum {
    READER("READER"),
    PUBLISHER("PUBLISHER"),
    ADMIN("ADMIN");

    private String name;
}
