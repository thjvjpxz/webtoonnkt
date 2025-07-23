package com.thjvjpxx.backend_comic.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.thjvjpxx.backend_comic.model.Level;
import com.thjvjpxx.backend_comic.model.LevelType;

@Repository
public interface LevelRepository extends JpaRepository<Level, String> {
    /**
     * Kiểm tra xem level có tồn tại theo tên hay không
     * 
     * @param name tên level cần kiểm tra
     * @return true nếu level với tên này đã tồn tại, false nếu chưa
     */
    boolean existsByName(String name);

    /**
     * Tìm tất cả level có phân trang
     * 
     * @param pageable thông tin phân trang
     * @return danh sách level theo trang
     */
    Page<Level> findAll(Pageable pageable);

    /**
     * Tìm level theo tên hoặc tên loại level với phân trang
     * 
     * @param name tên level cần tìm
     * @param levelTypeName tên loại level cần tìm
     * @param pageable thông tin phân trang
     * @return danh sách level phù hợp với phân trang
     */
    Page<Level> findByNameContainingOrLevelTypeNameContaining(String name, String levelTypeName, Pageable pageable);

    /**
     * Tìm level theo tên
     * 
     * @param name tên level cần tìm
     * @return Optional chứa level nếu tìm thấy
     */
    Optional<Level> findByName(String name);

    /**
     * Tìm level theo số level và loại level
     * 
     * @param levelNumber số thứ tự của level
     * @param levelType loại level
     * @return Optional chứa level nếu tìm thấy
     */
    Optional<Level> findByLevelNumberAndLevelType(int levelNumber, LevelType levelType);

    /**
     * Tìm danh sách level theo loại level, sắp xếp theo số level tăng dần
     * 
     * @param levelType loại level cần tìm
     * @return Optional chứa danh sách level được sắp xếp theo số level
     */
    Optional<List<Level>> findByLevelTypeOrderByLevelNumberAsc(LevelType levelType);
}
