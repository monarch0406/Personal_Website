// src/main/java/com/example/demo/entity/Project.java
package com.example.demo.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "projects")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(length = 1000)
    private String description;

    @ElementCollection
    @CollectionTable(
        name = "project_technologies",
        joinColumns = @JoinColumn(name = "project_id")
    )
    @Column(name = "technology")
    private List<String> technologies = new ArrayList<>();

    private String imageUrl;

    private String year;

    // 新增：專案網址
    @Column(name = "project_url", length = 500)
    private String projectUrl;

    public Project() {}

    public Project(
        Long id,
        String name,
        String description,
        List<String> technologies,
        String imageUrl,
        String year,
        String projectUrl
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.technologies = technologies;
        this.imageUrl = imageUrl;
        this.year = year;
        this.projectUrl = projectUrl;
    }

    // --- Getters & Setters ---

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }

    public List<String> getTechnologies() {
        return technologies;
    }
    public void setTechnologies(List<String> technologies) {
        this.technologies = technologies;
    }

    public String getImageUrl() {
        return imageUrl;
    }
    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getYear() {
        return year;
    }
    public void setYear(String year) {
        this.year = year;
    }

    public String getProjectUrl() {
        return projectUrl;
    }
    public void setProjectUrl(String projectUrl) {
        this.projectUrl = projectUrl;
    }
}
