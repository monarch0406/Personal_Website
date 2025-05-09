package com.example.demo.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entity.WorkExperience;
import com.example.demo.service.WorkExperienceService;

@RestController
@RequestMapping("/api/experiences")
public class WorkExperienceController {

    private final WorkExperienceService service;

    public WorkExperienceController(WorkExperienceService service) {
        this.service = service;
    }

    @GetMapping
    public List<WorkExperience> listAll() {
        return service.listAll();
    }

    @GetMapping("/{id}")
    public WorkExperience getOne(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public WorkExperience create(@RequestBody WorkExperience exp) {
        return service.create(exp);
    }

    @PutMapping("/{id}")
    public WorkExperience update(
            @PathVariable Long id,
            @RequestBody WorkExperience exp) {
        return service.update(id, exp);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
