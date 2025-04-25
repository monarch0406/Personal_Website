package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
// 指定 Entity 類別的 package
@EntityScan(basePackages = "com.example.demo.entity")
// 指定 Repository 介面的 package
@EnableJpaRepositories(basePackages = "com.example.demo.repository")
public class DemoApplication {
  public static void main(String[] args) {
    SpringApplication.run(DemoApplication.class, args);
  }
}

