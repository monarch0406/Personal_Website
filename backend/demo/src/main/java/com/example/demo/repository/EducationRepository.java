// src/main/java/com/example/demo/repository/EducationRepository.java
package com.example.demo.repository;

import com.example.demo.entity.Education;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EducationRepository extends JpaRepository<Education, Long> {
    // JpaRepository 已經提供基本 CRUD，若需自訂查詢再新增方法即可
}
