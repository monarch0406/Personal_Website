// src/main/java/com/example/demo/service/IntroductionService.java
package com.example.demo.service;

import com.example.demo.entity.Introduction;
import com.example.demo.repository.IntroductionRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDate;

@Service
public class IntroductionService {
    private final IntroductionRepository repo;

    public IntroductionService(IntroductionRepository repo) {
        this.repo = repo;
    }

    public Introduction get() {
        return repo.findById(1L).orElseGet(() -> {
            Introduction intro = new Introduction();
            intro.setLastUpdated(LocalDate.now());
            intro.setContent("");
            return repo.save(intro);
        });
    }

    public Introduction update(String content) {
        Introduction intro = get();
        intro.setContent(content);
        intro.setLastUpdated(LocalDate.now());
        return repo.save(intro);
    }
}
