// src/main/java/com/example/demo/repository/AwardRepository.java
package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.entity.Award;

public interface AwardRepository extends JpaRepository<Award, Long> {}

