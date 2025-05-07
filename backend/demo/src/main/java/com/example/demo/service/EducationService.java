// src/main/java/com/example/demo/service/EducationService.java
package com.example.demo.service;

import com.example.demo.entity.Education;
import com.example.demo.repository.EducationRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EducationService {
    private final EducationRepository repo;

    public EducationService(EducationRepository repo) {
        this.repo = repo;
    }

    /** 取得所有學歷 */
    public List<Education> listAll() {
        return repo.findAll();
    }

    /** 新增一筆學歷 */
    public Education create(Education edu) {
        return repo.save(edu);
    }

    /** 依 id 更新學歷，若不存在則回傳空 Optional */
    public Optional<Education> update(Long id, Education eduData) {
        return repo.findById(id).map(edu -> {
            edu.setSchool(eduData.getSchool());
            edu.setDegree(eduData.getDegree());
            edu.setLevel(eduData.getLevel());
            edu.setStartDate(eduData.getStartDate());
            edu.setEndDate(eduData.getEndDate());
            edu.setCity(eduData.getCity());
            edu.setDistrict(eduData.getDistrict());
            edu.setGpa(eduData.getGpa());
            return repo.save(edu);
        });
    }

    /** 刪除學歷 */
    public void delete(Long id) {
        repo.deleteById(id);
    }
}

