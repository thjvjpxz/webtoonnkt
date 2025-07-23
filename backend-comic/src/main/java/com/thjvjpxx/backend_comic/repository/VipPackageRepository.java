package com.thjvjpxx.backend_comic.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.thjvjpxx.backend_comic.model.VipPackage;

@Repository
public interface VipPackageRepository extends JpaRepository<VipPackage, String> {

	/**
	 * Tìm kiếm gói VIP theo từ khóa trong tên hoặc mô tả với phân trang
	 * @param search từ khóa tìm kiếm trong tên hoặc mô tả gói VIP (có thể null hoặc rỗng)
	 * @param pageable thông tin phân trang và sắp xếp
	 * @return danh sách gói VIP khớp từ khóa tìm kiếm với phân trang
	 */
	@Query("SELECT v FROM vip_packages v WHERE " +
			"(:search IS NULL OR :search = '' OR " +
			"LOWER(v.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
			"LOWER(v.description) LIKE LOWER(CONCAT('%', :search, '%')))")
	Page<VipPackage> findBySearchTerm(@Param("search") String search, Pageable pageable);

	/**
	 * Tìm kiếm gói VIP theo từ khóa và trạng thái hoạt động với phân trang
	 * @param search từ khóa tìm kiếm trong tên hoặc mô tả gói VIP (có thể null hoặc rỗng)
	 * @param isActive trạng thái hoạt động của gói VIP (true: đang hoạt động, false: ngưng hoạt động, null: tất cả)
	 * @param pageable thông tin phân trang và sắp xếp
	 * @return danh sách gói VIP khớp điều kiện tìm kiếm và trạng thái với phân trang
	 */
	@Query("SELECT v FROM vip_packages v WHERE " +
			"(:isActive IS NULL OR v.isActive = :isActive) AND " +
			"(:search IS NULL OR :search = '' OR " +
			"LOWER(v.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
			"LOWER(v.description) LIKE LOWER(CONCAT('%', :search, '%')))")
	Page<VipPackage> findBySearchTermAndStatus(@Param("search") String search, @Param("isActive") Boolean isActive,
			Pageable pageable);

	/**
	 * Tìm gói VIP theo trạng thái hoạt động với phân trang
	 * @param isActive trạng thái hoạt động của gói VIP (true: đang hoạt động, false: ngưng hoạt động, null: tất cả)
	 * @param pageable thông tin phân trang và sắp xếp
	 * @return danh sách gói VIP theo trạng thái hoạt động với phân trang
	 */
	@Query("SELECT v FROM vip_packages v WHERE " +
			"(:isActive IS NULL OR v.isActive = :isActive)")
	Page<VipPackage> findByIsActive(@Param("isActive") Boolean isActive,
			Pageable pageable);

	/**
	 * Kiểm tra tồn tại gói VIP theo tên (không phân biệt chữ hoa thường)
	 * @param name tên gói VIP cần kiểm tra
	 * @return true nếu đã tồn tại gói VIP với tên này, false nếu chưa tồn tại
	 */
	boolean existsByNameIgnoreCase(String name);

	/**
	 * Kiểm tra tồn tại gói VIP theo tên nhưng loại trừ ID cụ thể (dùng cho cập nhật)
	 * @param name tên gói VIP cần kiểm tra
	 * @param id ID của gói VIP cần loại trừ khỏi kiểm tra
	 * @return true nếu đã tồn tại gói VIP khác với tên này, false nếu chưa tồn tại
	 */
	boolean existsByNameIgnoreCaseAndIdNot(String name, String id);

	/**
	 * Tìm tất cả gói VIP theo trạng thái hoạt động
	 * @param isActive trạng thái hoạt động của gói VIP (true: đang hoạt động, false: ngưng hoạt động)
	 * @return danh sách tất cả gói VIP theo trạng thái hoạt động
	 */
	List<VipPackage> findByIsActive(Boolean isActive);
}