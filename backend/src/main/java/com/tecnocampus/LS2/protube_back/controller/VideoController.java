package com.tecnocampus.LS2.protube_back.controller;

import com.tecnocampus.LS2.protube_back.VideoJson;
import com.tecnocampus.LS2.protube_back.domain.Video;
import com.tecnocampus.LS2.protube_back.service.VideoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/videos")
public class VideoController {

    @Autowired
    private VideoService videoService;
    
    @GetMapping("/miniature/{id}")
    public ResponseEntity<byte[]> getMiniatureById(@PathVariable Long id) {
        try {
            byte[] miniature = videoService.getMiniatureById(id-1);
            HttpHeaders headers = new HttpHeaders();
            headers.set("Content-Type", "image/webp");
            return new ResponseEntity<>(miniature, headers, HttpStatus.OK);
        } catch (IOException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/info/{id}")
    public ResponseEntity<Map<String, Object>> getVideoInfoById(@PathVariable Long id) {
        Map<String, Object> response = videoService.getVideoInfoById(id);
        if (response.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/allVideosInfo")
    public ResponseEntity<List<Map<String, Object>>> getAllVideosInfo() {
        List<Map<String, Object>> videosInfo = videoService.getAllVideosInfo();
        return new ResponseEntity<>(videosInfo, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getAllVideoInfoById(@PathVariable Long id) {
        Map<String, Object> video = videoService.getAllVideoInfoById(id);
        if (video != null) {
            return new ResponseEntity<>(video, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/{id}/comments")
    public ResponseEntity<List<Map<String, Object>>> getCommentsById(@PathVariable Long id) {
        List<Map<String, Object>> comments = videoService.getCommentsById(id);
        return new ResponseEntity<>(comments, HttpStatus.OK);
    }

    @GetMapping("/video/{id}")
    public ResponseEntity<byte[]> getVideoMP4ById(@PathVariable Long id) {
        try {
            byte[] video = videoService.getVideoMP4ById(id-1);
            HttpHeaders headers = new HttpHeaders();
            headers.set("Content-Type", "video/mp4");
            return new ResponseEntity<>(video, headers, HttpStatus.OK);
        } catch (IOException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<Void> updateLikeStatus(@PathVariable Long id, @RequestParam boolean isLike) {
        videoService.updateLikeStatus(id, isLike);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/{id}/addComment")
    public ResponseEntity<String> addCommentById(@PathVariable Long id, @RequestParam String text, @RequestParam String username) {
        boolean success = videoService.addCommentById(id, text, username);
        if (success) {
            return new ResponseEntity<>("Comment added successfully!", HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>("Failed to add comment.", HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/uploadVideo")
    public ResponseEntity<String> uploadVideo(
            @RequestParam("imageFile") MultipartFile imageFile,
            @RequestParam("videoFile") MultipartFile videoFile,
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam String category,
            @RequestParam String username) {
        try {
            Long videoId = videoService.uploadVideoInfo(title, description, category, username);
            videoService.saveImage(imageFile, videoId);
            videoService.saveVideo(videoFile, videoId);
            return new ResponseEntity<>("Video uploaded successfully!", HttpStatus.CREATED);
        } catch (IOException e) {
            return new ResponseEntity<>("Failed to upload files.", HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Failed to upload video.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/{id}/edit")
    public ResponseEntity<String> editVideoById(
            @PathVariable Long id,
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam String category) {
        boolean success = videoService.editVideoById(id, title, description, category);
        if (success) {
            return new ResponseEntity<>("Video edited successfully!", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Failed to edit video.", HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{id}/delete")
    public ResponseEntity<String> deleteVideoById(@PathVariable Long id) {
        boolean success = videoService.deleteVideoById(id);
        if (success) {
            return new ResponseEntity<>("Video deleted successfully!", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Failed to delete video.", HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/{id}/details")
    public ResponseEntity<Map<String, Object>> getVideoDetailsById(@PathVariable Long id) {
        Map<String, Object> videoDetails = videoService.getVideoDetailsById(id);
        if (videoDetails != null) {
            return new ResponseEntity<>(videoDetails, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}