// src/main/java/com/example/demo/entity/Category.java
package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;  // ← 匯入這行
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "category")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    // 一個分類底下可有多個技能
    @OneToMany(
        mappedBy = "category",
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    @JsonManagedReference      // ← 加在「父」(One) 端
    private List<Skill> skills = new ArrayList<>();

    // JPA 需要
    public Category() {}

    public Category(String name) {
        this.name = name;
    }

    // getters & setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public List<Skill> getSkills() { return skills; }
    public void setSkills(List<Skill> skills) { this.skills = skills; }
}


