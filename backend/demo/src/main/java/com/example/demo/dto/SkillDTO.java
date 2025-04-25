// src/main/java/com/example/demo/dto/SkillDTO.java
package com.example.demo.dto;

public class SkillDTO {
    private String name;
    private String description;
    private Long categoryId;
    // getter / setter
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
}

