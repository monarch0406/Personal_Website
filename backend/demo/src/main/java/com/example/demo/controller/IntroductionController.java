// src/main/java/com/example/demo/controller/IntroductionController.java
package com.example.demo.controller;

import com.example.demo.entity.Introduction;
import com.example.demo.service.IntroductionService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/introduction")
@CrossOrigin("http://localhost:3000")
public class IntroductionController {
    private final IntroductionService svc;

    public IntroductionController(IntroductionService svc) {
        this.svc = svc;
    }

    @GetMapping
    public Introduction getIntroduction() {
        return svc.get();
    }

    @PutMapping
    public Introduction updateIntroduction(@RequestBody Introduction newIntro) {
        return svc.update(newIntro.getContent());
    }
}
