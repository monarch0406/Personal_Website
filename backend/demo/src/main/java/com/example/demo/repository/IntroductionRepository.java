// src/main/java/com/example/demo/repository/IntroductionRepository.java
package com.example.demo.repository;

import com.example.demo.entity.Introduction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IntroductionRepository extends JpaRepository<Introduction, Long> { }
