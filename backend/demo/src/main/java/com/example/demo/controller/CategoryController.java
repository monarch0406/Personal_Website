// src/main/java/com/example/demo/controller/CategoryController.java
package com.example.demo.controller;

import com.example.demo.entity.Category;
import com.example.demo.service.CategoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService svc;

    public CategoryController(CategoryService svc) {
        this.svc = svc;
    }

    @GetMapping
    public List<Category> getAll() {
        return svc.listAll();
    }

    @PostMapping
    public Category add(@RequestBody Map<String, String> body) {
        return svc.create(body.get("name"));
    }

    @PutMapping("/{id}")
    public Category update(
        @PathVariable Long id,
        @RequestBody Map<String, String> body
    ) {
        return svc.update(id, body.get("name"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        svc.delete(id);
        return ResponseEntity.noContent().build();
    }
}
