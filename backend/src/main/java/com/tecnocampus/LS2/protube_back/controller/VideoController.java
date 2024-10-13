package com.tecnocampus.LS2.protube_back.controller;

import com.tecnocampus.LS2.protube_back.service.VideoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api")
public class VideoController {

    @Autowired
    private VideoService videoService;

    @GetMapping("/getAllVideos")
    public List<String> getAllVideos() throws IOException {
        return videoService.getAllVideos();
    }
}