// src/main/java/com/example/demo/service/AwardService.java
package com.example.demo.service;

import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.demo.entity.Award;
import com.example.demo.repository.AwardRepository;

@Service
@Transactional
public class AwardService {
    private final AwardRepository repo;

    public AwardService(AwardRepository repo) {
        this.repo = repo;
    }

    public List<Award> getAll() {
        return repo.findAll();
    }

    public Award getById(Long id) {
        return repo.findById(id)
                   .orElseThrow(() -> new RuntimeException("Award not found"));
    }

    public Award create(Award award) {
        return repo.save(award);
    }

    public Award update(Long id, Award data) {
        Award award = getById(id);
        award.setName(data.getName());
        award.setDescription(data.getDescription());
        award.setDate(data.getDate());
        award.setImageUrl(data.getImageUrl());
        return repo.save(award);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}
