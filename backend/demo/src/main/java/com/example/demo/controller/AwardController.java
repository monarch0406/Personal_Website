// src/main/java/com/example/demo/controller/AwardController.java
package com.example.demo.controller;

import java.util.List;
import org.springframework.web.bind.annotation.*;
import com.example.demo.entity.Award;
import com.example.demo.service.AwardService;

@RestController
@RequestMapping("/api/awards")
public class AwardController {
    private final AwardService service;

    public AwardController(AwardService service) {
        this.service = service;
    }

    @GetMapping
    public List<Award> list() {
        return service.getAll();
    }

    @PostMapping
    public Award create(@RequestBody Award award) {
        return service.create(award);
    }

    @PutMapping("/{id}")
    public Award update(@PathVariable Long id,
                        @RequestBody Award award) {
        return service.update(id, award);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
