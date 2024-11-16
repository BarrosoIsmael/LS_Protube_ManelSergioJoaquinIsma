package com.tecnocampus.LS2.protube_back.service;

import com.tecnocampus.LS2.protube_back.VideoJson;
import com.tecnocampus.LS2.protube_back.domain.Comment;
import com.tecnocampus.LS2.protube_back.domain.User;
import com.tecnocampus.LS2.protube_back.domain.Video;
import com.tecnocampus.LS2.protube_back.repository.CommentRepository;
import com.tecnocampus.LS2.protube_back.repository.UserRepository;
import com.tecnocampus.LS2.protube_back.repository.VideoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CommentRepository commentRepository;

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

    public Map<String, Object> getVideoById(Long id) {
        Optional<Video> videoOpt = videoRepository.findById(id);
        if (videoOpt.isPresent()) {
            Video video = videoOpt.get();
            Map<String, Object> response = new HashMap<>();
            response.put("title", video.getTitle());
            response.put("user", video.getUser().getUsername());
            response.put("description", video.getDescription());
            response.put("tags", video.getTags());
            response.put("category", video.getCategory().getName());
            response.put("likes", video.getLikes());
            return response;
        } else {
            return null;
        }
    }

    public byte[] getVideoMP4ById(Long id) throws IOException {
        Path path = Paths.get(videoDirectory, id + ".mp4");
        return Files.readAllBytes(path);
    }

    @Transactional
    public void updateLikeStatus(Long videoId, boolean isLike) {
        Optional<Video> videoOpt = videoRepository.findById(videoId);
        if (videoOpt.isPresent()) {
            Video video = videoOpt.get();
            if (isLike) {
                video.addLike();
            } else {
                video.addDislike();
            }
        }
    }

    public boolean addCommentToVideo(Long videoId, String text, String username) {
        Optional<Video> videoOpt = videoRepository.findById(videoId);
        Optional<User> userOpt = userRepository.findByUsername(username);

        if (videoOpt.isPresent() && userOpt.isPresent()) {
            Video video = videoOpt.get();
            User user = userOpt.get();
            Comment comment = new Comment(video, text, user);
            commentRepository.save(comment);
            return true;
        }
        return false;
    }
}