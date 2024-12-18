package com.tecnocampus.LS2.protube_back.service;

import com.tecnocampus.LS2.protube_back.domain.Category;
import com.tecnocampus.LS2.protube_back.domain.Comment;
import com.tecnocampus.LS2.protube_back.domain.User;
import com.tecnocampus.LS2.protube_back.domain.Video;
import com.tecnocampus.LS2.protube_back.repository.CategoryRepository;
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

    @Autowired
    private CategoryRepository categoryRepository;

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

    public List<Map<String, Object>> getCommentsById(Long id) {
        Optional<Video> videoOpt = videoRepository.findById(id);
        return videoOpt.map(video -> video.getComments().stream().map(comment -> {
            Map<String, Object> commentInfo = new HashMap<>();
            commentInfo.put("id", comment.getId());
            commentInfo.put("text", comment.getText());
            commentInfo.put("author", comment.getUser().getUsername());
            return commentInfo;
        }).collect(Collectors.toList())).orElse(Collections.emptyList());
    }

    public Map<String, Object> getAllVideoInfoById(Long id) {
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

    public boolean addCommentById(Long videoId, String text, String username) {
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

    public void saveImage(MultipartFile file, Long lastId) throws IOException {
        Path newPath = Paths.get(videoDirectory, lastId + ".webp");
        Files.copy(file.getInputStream(), newPath, StandardCopyOption.REPLACE_EXISTING);
    }

    public void saveVideo(MultipartFile file, Long lastId) throws IOException {
        Path newPath = Paths.get(videoDirectory, lastId + ".mp4");
        Files.copy(file.getInputStream(), newPath, StandardCopyOption.REPLACE_EXISTING);
    }

    public Long uploadVideoInfo(String title, String description, String category, String username) throws Exception {
        try {
            String formattedCategory = formatFirstUpper(category);

            Category videoCategory = categoryRepository.findByName(formattedCategory)
                    .orElseGet(() -> {
                        Category newCategory = new Category();
                        newCategory.setName(formattedCategory);
                        categoryRepository.save(newCategory);
                        return newCategory;
                    });

            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Video newVideo = new Video();
            newVideo.setTitle(title);
            newVideo.setDescription(description);
            newVideo.setCategory(videoCategory);
            newVideo.setUser(user);

            videoRepository.save(newVideo);
            return newVideo.getId() - 1;
        } catch (Exception e) {
            throw new Exception("Error uploading new video: " + e.getMessage(), e);
        }
}

    @Transactional
    public boolean editVideoById(Long videoId, String title, String description, String category) {
        Optional<Video> videoOpt = videoRepository.findById(videoId);
        if (videoOpt.isPresent()) {
            Video video = videoOpt.get();
            video.setTitle(title);
            video.setDescription(description);

            String formattedCategory = formatFirstUpper(category);

            Category videoCategory = categoryRepository.findByName(formattedCategory)
                    .orElseGet(() -> {
                        Category newCategory = new Category();
                        newCategory.setName(formattedCategory);
                        categoryRepository.save(newCategory);
                        return newCategory;
                    });

            video.setCategory(videoCategory);
            return true;
        }
        return false;
    }

    private String formatFirstUpper(String text) {
        if (text == null || text.isEmpty()) {
            return text;
        }
        return text.substring(0, 1).toUpperCase() + text.substring(1).toLowerCase();
    }

    @Transactional
    public boolean deleteVideoById(Long videoId) {
        if (videoRepository.existsById(videoId)) {
            videoRepository.deleteById(videoId);
            return deleteVideoFiles(videoId);
        }
        return false;
    }

    public boolean deleteVideoFiles(Long videoId) {
        try {
            Files.deleteIfExists(Paths.get(videoDirectory, (videoId-1) + ".webp"));
            Files.deleteIfExists(Paths.get(videoDirectory, (videoId-1) + ".mp4"));
            return true;
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }
    }

    public Map<String, Object> getVideoDetailsById(Long id) {
        Optional<Video> videoOpt = videoRepository.findById(id);
        if (videoOpt.isPresent()) {
            Video video = videoOpt.get();
            Map<String, Object> response = new HashMap<>();
            response.put("title", video.getTitle());
            response.put("description", video.getDescription() != null ? video.getDescription() : "");
            response.put("category", video.getCategory() != null ? video.getCategory().getName() : "");
            return response;
        } else {
            return null;
        }
    }

    public List<Map<String, Object>> searchVideosByTitle(String query) {
        return videoRepository.findByTitleContainingIgnoreCase(query).stream().map(video -> {
            Map<String, Object> videoInfo = new HashMap<>();
            videoInfo.put("id", video.getId());
            videoInfo.put("title", video.getTitle());
            videoInfo.put("user", video.getUser().getUsername());
            return videoInfo;
        }).collect(Collectors.toList());
    }
}