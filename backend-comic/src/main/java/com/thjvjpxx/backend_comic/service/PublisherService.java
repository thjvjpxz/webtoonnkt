package com.thjvjpxx.backend_comic.service;

import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.model.User;

/**
 * Service xử lý API quản lý truyện của nhà xuất bản
 */
public interface PublisherService {

	/**
	 * Lấy danh sách truyện của nhà xuất bản hiện tại
	 * 
	 * @param currentUser người dùng hiện tại (nhà xuất bản)
	 * @param search      từ khóa tìm kiếm theo tên truyện
	 * @param status      trạng thái truyện (đang phát hành, hoàn thành, tạm dừng,
	 *                    etc.)
	 * @param category    thể loại truyện
	 * @param page        số trang hiện tại (bắt đầu từ 0)
	 * @param limit       số lượng truyện trên mỗi trang
	 * @return BaseResponse chứa danh sách truyện và thông tin phân trang
	 */
	BaseResponse<?> getMyComics(User currentUser, String search, String status,
			String category, int page, int limit);

	/**
	 * Lấy danh sách tất cả chương truyện của nhà xuất bản
	 * 
	 * @param currentUser người dùng hiện tại (nhà xuất bản)
	 * @param page        số trang hiện tại (bắt đầu từ 0)
	 * @param limit       số lượng chương truyện trên mỗi trang
	 * @param search      từ khóa tìm kiếm theo tên chương
	 * @param comicId     mã định danh của truyện (optional - nếu muốn lọc theo
	 *                    truyện cụ thể)
	 * @return BaseResponse chứa danh sách chương truyện và thông tin phân trang
	 */
	BaseResponse<?> getAllChapters(User currentUser, int page, int limit, String search, String comicId);

}