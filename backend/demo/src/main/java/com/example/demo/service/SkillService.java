// src/main/java/com/example/demo/service/SkillService.java
package com.example.demo.service;

import com.example.demo.entity.Category;
import com.example.demo.entity.Skill;
import com.example.demo.repository.CategoryRepository;
import com.example.demo.repository.SkillRepository;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;  // ← 注意這裡
import java.util.List;

@Service
public class SkillService {

    private final SkillRepository skillRepo;
    private final CategoryRepository categoryRepo;

    public SkillService(SkillRepository skillRepo,
                        CategoryRepository categoryRepo) {
        this.skillRepo = skillRepo;
        this.categoryRepo = categoryRepo;
    }

    public List<Skill> listAll() {
        return skillRepo.findAll();
    }

    public Skill create(String name, String description, Long categoryId) {
        Category cat = categoryRepo.findById(categoryId)
            .orElseThrow(() -> new EntityNotFoundException("Category not found: " + categoryId));
        Skill s = new Skill(name, description, cat);
        return skillRepo.save(s);
    }

    public Skill update(Long skillId,
                        String name,
                        String description,
                        Long categoryId) {
        Skill s = skillRepo.findById(skillId)
            .orElseThrow(() -> new EntityNotFoundException("Skill not found: " + skillId));
        Category cat = categoryRepo.findById(categoryId)
            .orElseThrow(() -> new EntityNotFoundException("Category not found: " + categoryId));
        s.setName(name);
        s.setDescription(description);
        s.setCategory(cat);
        return skillRepo.save(s);
    }

    public void delete(Long id) {
        skillRepo.deleteById(id);
    }
}


