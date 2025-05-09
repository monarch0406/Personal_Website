// src/main/java/com/example/demo/service/CertificationService.java
package com.example.demo.service;

import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.demo.entity.Certification;
import com.example.demo.repository.CertificationRepository;

@Service
@Transactional
public class CertificationService {
    private final CertificationRepository repo;

    public CertificationService(CertificationRepository repo) {
        this.repo = repo;
    }

    public List<Certification> getAll() {
        return repo.findAll();
    }

    public Certification getById(Long id) {
        return repo.findById(id)
                   .orElseThrow(() -> new RuntimeException("Certification not found"));
    }

    public Certification create(Certification cert) {
        return repo.save(cert);
    }

    public Certification update(Long id, Certification data) {
        Certification cert = getById(id);
        cert.setName(data.getName());
        cert.setDescription(data.getDescription());
        cert.setDate(data.getDate());
        cert.setImageUrl(data.getImageUrl());
        return repo.save(cert);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}

