package com.tecnocampus.LS2.protube_back.controller;

import com.tecnocampus.LS2.protube_back.VideoJson;
import com.tecnocampus.LS2.protube_back.domain.Video;
import com.tecnocampus.LS2.protube_back.service.VideoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
    public ResponseEntity<Map<String, String>> getVideoInfoById(@PathVariable Long id) {
        Optional<Video> video = videoService.getVideoInfoById(id);
        if (video.isPresent()) {
            Map<String, String> response = new HashMap<>();
            response.put("id", String.valueOf(id));
            response.put("title", video.get().getTitle());
            response.put("user", video.get().getUser().getUsername());
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/allVideosInfo")
    public ResponseEntity<List<Map<String, String>>> getAllVideosInfo() {
        List<Map<String, String>> videosInfo = videoService.getAllVideosInfo();
        return new ResponseEntity<>(videosInfo, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<VideoJson> getVideoById(@PathVariable Long id) {
        Optional<VideoJson> video = videoService.getVideoById(id);
        if (video.isPresent()) {
            return new ResponseEntity<>(video.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/{id}/comments")
    public ResponseEntity<List<VideoJson.CommentJson>> getCommentsByVideoId(@PathVariable Long id) {
        Optional<Video> video = videoService.getVideoInfoById(id);
        if (video.isPresent()) {
            List<VideoJson.CommentJson> comments = video.get().getComments().stream().map(comment -> {
                VideoJson.CommentJson commentJson = new VideoJson.CommentJson();
                commentJson.setText(comment.getText());
                commentJson.setAuthor(comment.getUser().getUsername());
                return commentJson;
            }).collect(Collectors.toList());
            return new ResponseEntity<>(comments, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
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

}