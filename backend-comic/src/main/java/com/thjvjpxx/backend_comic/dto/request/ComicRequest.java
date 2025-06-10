package com.thjvjpxx.backend_comic.dto.request;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ComicRequest {
    @NotBlank(message = "NAME_COMIC_NOT_EMPTY")
    String name;
    @NotBlank(message = "SLUG_COMIC_NOT_EMPTY")
    String slug;
    String description;
    String author;
    String status;
    String thumbUrl;
    String originName;
    List<String> categories;

    // Các flag để check thay đổi - client sẽ set true khi có thay đổi
    /**
     * Set true khi slug thay đổi
     * - Sẽ validate slug không trùng với comic khác
     * - Sẽ rename thumbnail file nếu có
     */
    Boolean isSlugChanged = false;

    /**
     * Set true khi URL thumbnail thay đổi (không upload file mới)
     * - Sẽ xóa image cũ nếu có
     * - Sẽ cập nhật thumbUrl từ request
     */
    Boolean isThumbUrlChanged = false;

    /**
     * Set true khi danh sách categories thay đổi
     * - Sẽ validate và cập nhật categories
     */
    Boolean isCategoriesChanged = false;

    /**
     * Set true khi muốn xóa thumbnail hiện tại
     * - Sẽ xóa file thumbnail và set thumbUrl = null
     * - Ưu tiên cao hơn isThumbUrlChanged
     */
    Boolean shouldRemoveThumbnail = false;
}
