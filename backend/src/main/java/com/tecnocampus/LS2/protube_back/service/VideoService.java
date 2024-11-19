package com.tecnocampus.LS2.protube_back.service;

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
import org.springframework.web.multipart.MultipartFile;
import java.util.*;

import java.io.IOException;
import java.nio.file.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import java.nio.file.Path;
import java.nio.file.Paths;

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

    public Map<String, Object> getVideoInfoById(Long id) {
        Optional<Video> videoOpt = videoRepository.findById(id);
        if (videoOpt.isPresent()) {
            Video video = videoOpt.get();
            Map<String, Object> response = new HashMap<>();
            response.put("id", id);
            response.put("title", video.getTitle());
            response.put("user", video.getUser().getUsername());
            return response;
        } else {
            return Collections.emptyMap();
        }
    }

    public List<Map<String, Object>> getAllVideosInfo() {
        return videoRepository.findAll().stream().map(video -> {
            Map<String, Object> videoInfo = new HashMap<>();
            videoInfo.put("id", video.getId());
            videoInfo.put("title", video.getTitle());
            videoInfo.put("user", video.getUser().getUsername());
            return videoInfo;
        }).collect(Collectors.toList());
    }

    public List<Map<String, Object>> getCommentsByVideoId(Long id) {
        Optional<Video> videoOpt = videoRepository.findById(id);
        return videoOpt.map(video -> video.getComments().stream().map(comment -> {
            Map<String, Object> commentInfo = new HashMap<>();
            commentInfo.put("text", comment.getText());
            commentInfo.put("author", comment.getUser().getUsername());
            commentInfo.put("likes", comment.getLikes());
            commentInfo.put("dislikes", comment.getDislikes());
            return commentInfo;
        }).collect(Collectors.toList())).orElse(Collections.emptyList());
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
            response.put("dislikes", video.getDislikes());
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

    private Long getLastWebpId() throws IOException {
        try (Stream<Path> paths = Files.list(Paths.get(videoDirectory))) {
            return paths
                    .filter(path -> path.toString().endsWith(".webp"))
                    .map(path -> path.getFileName().toString().replace(".webp", ""))
                    .mapToLong(Long::parseLong)
                    .max()
                    .orElse(0L);
        }
    }

    public void saveImage(MultipartFile file) throws IOException {
        Long newId = getLastWebpId() + 1;
        Path newPath = Paths.get(videoDirectory, newId + ".webp");

        Files.copy(file.getInputStream(), newPath, StandardCopyOption.REPLACE_EXISTING);
    }

    private Long getLastMp4Id() throws IOException {
        try (Stream<Path> paths = Files.list(Paths.get(videoDirectory))) {
            return paths
                    .filter(path -> path.toString().endsWith(".mp4"))
                    .map(path -> path.getFileName().toString().replace(".mp4", ""))
                    .mapToLong(Long::parseLong)
                    .max()
                    .orElse(0L);
        }
    }

    public void saveVideo(MultipartFile file) throws IOException {
        Long newId = getLastMp4Id() + 1;
        Path newPath = Paths.get(videoDirectory, newId + ".mp4");

        Files.copy(file.getInputStream(), newPath, StandardCopyOption.REPLACE_EXISTING);
    }
}