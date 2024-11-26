package com.tecnocampus.LS2.protube_back.repository;

import org.springframework.data.jpa.repository.Query;
import com.tecnocampus.LS2.protube_back.domain.Video;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VideoRepository extends JpaRepository<Video, Long> {
    List<Video> findByUserId(Long userId);
    @Query("SELECT MAX(v.id) FROM Video v")
    Long findMaxId();
}
