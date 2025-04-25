// src/main/java/com/example/demo/service/CategoryService.java
package com.example.demo.service;

import com.example.demo.entity.Category;
import com.example.demo.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import jakarta.persistence.EntityNotFoundException;  // ← 注意這裡
import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository repo;

    public CategoryService(CategoryRepository repo) {
        this.repo = repo;
    }

    /** 取得所有分類 */
    public List<Category> listAll() {
        return repo.findAll();
    }

    /** 新增一個分類 */
    public Category create(String name) {
        Category c = new Category(name);
        return repo.save(c);
    }

    /** 更新分類名稱 */
    public Category update(Long id, String newName) {
        Category c = repo.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Category not found: " + id));
        c.setName(newName);
        return repo.save(c);
    }

    /** 刪除某分類 */
    public void delete(Long id) {
        repo.deleteById(id);
    }
}


