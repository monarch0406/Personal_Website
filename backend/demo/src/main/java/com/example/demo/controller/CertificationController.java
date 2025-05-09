// src/main/java/com/example/demo/controller/CertificationController.java
package com.example.demo.controller;

import java.util.List;
import org.springframework.web.bind.annotation.*;
import com.example.demo.entity.Certification;
import com.example.demo.service.CertificationService;

@RestController
@RequestMapping("/api/certifications")
public class CertificationController {
    private final CertificationService service;

    public CertificationController(CertificationService service) {
        this.service = service;
    }

    @GetMapping
    public List<Certification> list() {
        return service.getAll();
    }

    @PostMapping
    public Certification create(@RequestBody Certification cert) {
        return service.create(cert);
    }

    @PutMapping("/{id}")
    public Certification update(@PathVariable Long id,
                                @RequestBody Certification cert) {
        return service.update(id, cert);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
