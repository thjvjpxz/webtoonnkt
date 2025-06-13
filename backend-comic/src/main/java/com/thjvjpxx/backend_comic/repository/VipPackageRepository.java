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
	 * Tìm kiếm gói VIP theo tên (có phân trang)
	 */
	@Query("SELECT v FROM vip_packages v WHERE " +
			"(:search IS NULL OR :search = '' OR " +
			"LOWER(v.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
			"LOWER(v.description) LIKE LOWER(CONCAT('%', :search, '%')))")
	Page<VipPackage> findBySearchTerm(@Param("search") String search, Pageable pageable);

	/**
	 * Tìm kiếm gói VIP theo tên và trạng thái active (có phân trang)
	 */
	@Query("SELECT v FROM vip_packages v WHERE " +
			"(:isActive IS NULL OR v.isActive = :isActive) AND " +
			"(:search IS NULL OR :search = '' OR " +
			"LOWER(v.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
			"LOWER(v.description) LIKE LOWER(CONCAT('%', :search, '%')))")
	Page<VipPackage> findBySearchTermAndStatus(@Param("search") String search, @Param("isActive") Boolean isActive,
			Pageable pageable);

	/**
	 * Tìm kiếm gói VIP theo trạng thái active (có phân trang)
	 */
	@Query("SELECT v FROM vip_packages v WHERE " +
			"(:isActive IS NULL OR v.isActive = :isActive)")
	Page<VipPackage> findByIsActive(@Param("isActive") Boolean isActive,
			Pageable pageable);

	/**
	 * Tìm gói VIP theo tên (kiểm tra trùng lặp)
	 */
	boolean existsByNameIgnoreCase(String name);

	/**
	 * Tìm gói VIP theo tên nhưng loại trừ ID hiện tại (cho update)
	 */
	boolean existsByNameIgnoreCaseAndIdNot(String name, String id);

	/**
	 * Tìm gói VIP theo trạng thái active
	 */
	List<VipPackage> findByIsActive(Boolean isActive);
}