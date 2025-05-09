// src/main/java/com/example/demo/repository/CertificationRepository.java
package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.entity.Certification;

public interface CertificationRepository extends JpaRepository<Certification, Long> {}

