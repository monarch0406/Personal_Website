package com.example.demo.service;

import com.example.demo.entity.Activity;
import com.example.demo.repository.ActivityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ActivityService {
    @Autowired
    private ActivityRepository repo;

    public List<Activity> findAll() {
        return repo.findAll();
    }

    // 回傳 Optional，失敗時 empty
    public Optional<Activity> findById(Long id) {
        return repo.findById(id);
    }

    public Activity create(Activity activity) {
        return repo.save(activity);
    }

    public Activity update(Long id, Activity updated) {
        // 直接 orElse(null)，也可以 orElseThrow
        Activity act = repo.findById(id).orElse(null);
        if (act != null) {
            act.setTitle(updated.getTitle());
            act.setDescription(updated.getDescription());
            act.setDate(updated.getDate());
            act.setImageUrl(updated.getImageUrl());
            return repo.save(act);
        }
        return null;
    }

    public boolean delete(Long id) {
        if (repo.existsById(id)) {
            repo.deleteById(id);
            return true;
        }
        return false;
    }
}

