package com.thjvjpxx.backend_comic.dto.otruyen;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OTruyenResponse {
    private String status;
    private String message;
    private OTruyenData data;
}