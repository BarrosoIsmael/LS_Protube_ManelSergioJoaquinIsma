package com.tecnocampus.LS2.protube_back.service;

import com.tecnocampus.LS2.protube_back.VideoJson;
import com.tecnocampus.LS2.protube_back.domain.Video;
import com.tecnocampus.LS2.protube_back.repository.VideoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.io.IOException;

@Service
public class VideoService {

    @Value("${pro_tube.store.dir}")
    private String videoDirectory;

    @Autowired
    private VideoRepository videoRepository;

    public byte[] getMiniatureById(Long id) throws IOException {
        Path path = Paths.get(videoDirectory, id + ".webp");
        return Files.readAllBytes(path);
    }

    public Optional<Video> getVideoInfoById(Long id) {
        return videoRepository.findById(id);
    }

    public List<Map<String, String>> getAllVideosInfo() {
        return videoRepository.findAll().stream().map(video -> {
            Map<String, String> videoInfo = new HashMap<>();
            videoInfo.put("id", String.valueOf(video.getId()));
            videoInfo.put("title", video.getTitle());
            videoInfo.put("user", video.getUser().getUsername());
            return videoInfo;
        }).collect(Collectors.toList());
    }

    public Optional<VideoJson> getVideoById(Long id) {
        Optional<Video> video = videoRepository.findById(id);
        if (video.isPresent()) {
            Video v = video.get();
            VideoJson videoJson = new VideoJson();
            videoJson.setId(v.getId());
            videoJson.setWidth(v.getWidth());
            videoJson.setHeight(v.getHeight());
            videoJson.setDuration(v.getDuration());
            videoJson.setTitle(v.getTitle());
            videoJson.setUser(v.getUser().getUsername());

            VideoJson.Meta meta = new VideoJson.Meta();
            meta.setDescription(v.getDescription());
            meta.setCategories(List.of(v.getCategory().getName()));
            meta.setTags(v.getTags());
            meta.setComments(v.getComments().stream().map(comment -> {
                VideoJson.CommentJson commentJson = new VideoJson.CommentJson();
                commentJson.setText(comment.getText());
                commentJson.setAuthor(comment.getUser().getUsername());
                return commentJson;
            }).collect(Collectors.toList()));

            videoJson.setMeta(meta);
            return Optional.of(videoJson);
        } else {
            return Optional.empty();
        }
    }

    public byte[] getVideoMP4ById(Long id) throws IOException {
        Path path = Paths.get(videoDirectory, id + ".mp4");
        return Files.readAllBytes(path);
    }

}