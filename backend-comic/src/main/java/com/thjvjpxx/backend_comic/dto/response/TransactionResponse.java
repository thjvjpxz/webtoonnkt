package com.thjvjpxx.backend_comic.dto.response;

import java.time.LocalDateTime;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import com.fasterxml.jackson.annotation.JsonInclude;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TransactionResponse {

    String id; // ID giao dịch
    Double amount; // Số linh thạch
    String status; // Trạng thái giao dịch
    LocalDateTime updatedAt; // Thời gian cập nhật
}