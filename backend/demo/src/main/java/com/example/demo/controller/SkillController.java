// src/main/java/com/example/demo/controller/SkillController.java
package com.example.demo.controller;

import com.example.demo.entity.Skill;
import com.example.demo.service.SkillService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/skills")
public class SkillController {

    private final SkillService svc;

    public SkillController(SkillService svc) {
        this.svc = svc;
    }

    @GetMapping
    @Operation(
    summary = "Get all skills",
    responses = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved users")
    }
)

    public List<Skill> getAll() {
        return svc.listAll();
    }

    @PostMapping
    public Skill add(@RequestBody Map<String, Object> body) {
        String name = (String) body.get("name");
        String desc = (String) body.get("description");
        Long catId = Long.valueOf(body.get("categoryId").toString());
        return svc.create(name, desc, catId);
    }

    @PutMapping("/{id}")
    public Skill update(
        @PathVariable Long id,
        @RequestBody Map<String, Object> body
    ) {
        String name = (String) body.get("name");
        String desc = (String) body.get("description");
        Long catId = Long.valueOf(body.get("categoryId").toString());
        return svc.update(id, name, desc, catId);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        svc.delete(id);
        return ResponseEntity.noContent().build();
    }
}


