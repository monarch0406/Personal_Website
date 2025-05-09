package com.example.demo.service;

import com.example.demo.entity.WorkExperience;
import com.example.demo.repository.WorkExperienceRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WorkExperienceService {

    private final WorkExperienceRepository repo;

    public WorkExperienceService(WorkExperienceRepository repo) {
        this.repo = repo;
    }

    public List<WorkExperience> listAll() {
        return repo.findAll();
    }

    public WorkExperience getById(Long id) {
        return repo.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("WorkExperience not found: " + id));
    }

    public WorkExperience create(WorkExperience exp) {
        return repo.save(exp);
    }

    public WorkExperience update(Long id, WorkExperience exp) {
        WorkExperience existing = getById(id);
        existing.setCompany(exp.getCompany());
        existing.setPosition(exp.getPosition());
        existing.setLogoUrl(exp.getLogoUrl());
        existing.setStartDate(exp.getStartDate());
        existing.setEndDate(exp.getEndDate());
        existing.setLocation(exp.getLocation());
        existing.setDescription(exp.getDescription());
        existing.setSkills(exp.getSkills());
        return repo.save(existing);
    }

    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new EntityNotFoundException("Cannot delete, WorkExperience not found: " + id);
        }
        repo.deleteById(id);
    }
}