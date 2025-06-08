package com.thjvjpxx.backend_comic.dto.request;

import java.util.List;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BulkDeleteRequest {
    
    @NotNull(message = "BULK_DELETE_IDS_NOT_NULL")
    @NotEmpty(message = "BULK_DELETE_IDS_NOT_EMPTY") 
    List<String> ids;
} 