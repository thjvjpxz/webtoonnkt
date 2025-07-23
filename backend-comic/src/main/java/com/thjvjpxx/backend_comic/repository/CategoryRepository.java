package com.thjvjpxx.backend_comic.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.thjvjpxx.backend_comic.model.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, String> {
    /**
     * Tìm tất cả category
     * 
     * @param pageable Pageable
     * @return Page<Category>
     */
    Page<Category> findAll(Pageable pageable);

    /**
     * Tìm category theo name hoặc slug
     * 
     * @param name     Name
     * @param slug     Slug
     * @param pageable Pageable
     * @return Page<Category>
     */
    Page<Category> findByNameContainingOrSlugContaining(String name, String slug, Pageable pageable);

    /**
     * Tìm category theo slug
     * 
     * @param slug Slug
     * @return Category
     */
    Optional<Category> findBySlug(String slug);

    /**
     * Tìm category theo name
     * 
     * @param name Name
     * @return Category
     */
    Optional<Category> findByName(String name);

    /**
     * Truy vấn lấy ra 10 categories có nhiều truyện nhất
     * 
     * @return List<Category>
     */
    @Query(value = """
            SELECT c.*
            FROM categories c JOIN comic_categories cc ON c.id = cc.category_id
            GROUP BY c.id
            ORDER BY COUNT(cc.comic_id) DESC
            LIMIT 10
            """, nativeQuery = true)
    List<Category> findTop10CategoriesWithMostComics();
}
