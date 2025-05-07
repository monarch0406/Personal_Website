// src/main/java/com/example/demo/controller/EducationController.java
package com.example.demo.controller;

import com.example.demo.entity.Education;
import com.example.demo.service.EducationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/educations")
@CrossOrigin("http://localhost:3000")
public class EducationController {
    private final EducationService svc;

    public EducationController(EducationService svc) {
        this.svc = svc;
    }

    /** GET /api/educations — 列出所有學歷 */
    @GetMapping
    public List<Education> listAll() {
        return svc.listAll();
    }

    /** POST /api/educations — 新增學歷 */
    @PostMapping
    public Education create(@RequestBody Education edu) {
        return svc.create(edu);
    }

    /** PUT /api/educations/{id} — 更新學歷 */
    @PutMapping("/{id}")
    public ResponseEntity<Education> update(
            @PathVariable Long id,
            @RequestBody Education eduData) 
    {
        return svc.update(id, eduData)
                  .map(ResponseEntity::ok)
                  .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /** DELETE /api/educations/{id} — 刪除學歷 */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        svc.delete(id);
        return ResponseEntity.noContent().build();
    }
}
