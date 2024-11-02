package com.tecnocampus.LS2.protube_back.controller;

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
import java.util.List;

@RestController
@RequestMapping("/api/videos")
public class VideoController {

    @Autowired
    private VideoService videoService;

    @GetMapping("/getAllVideos")
    public List<String> getAllVideos() throws IOException {
        return videoService.getAllVideos();
    }

    /*@GetMapping("/miniature/{id}")
    public ResponseEntity<byte[]> getMiniatureById(@PathVariable Long id) {
        try {
            byte[] miniature = videoService.getMiniatureById(id);
            return new ResponseEntity<>(miniature, HttpStatus.OK);
        } catch (IOException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }*/
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
}