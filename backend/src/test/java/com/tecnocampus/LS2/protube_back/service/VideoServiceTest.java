package com.tecnocampus.LS2.protube_back.service;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import com.tecnocampus.LS2.protube_back.domain.Category;
import com.tecnocampus.LS2.protube_back.domain.Comment;
import com.tecnocampus.LS2.protube_back.domain.Video;
import com.tecnocampus.LS2.protube_back.domain.User;
import com.tecnocampus.LS2.protube_back.repository.CategoryRepository;
import com.tecnocampus.LS2.protube_back.repository.CommentRepository;
import com.tecnocampus.LS2.protube_back.repository.UserRepository;
import com.tecnocampus.LS2.protube_back.repository.VideoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public class VideoServiceTest {

    @Mock
    private VideoRepository videoRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private CommentRepository commentRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private MultipartFile multipartFile;

    @InjectMocks
    private VideoService videoService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testGetVideoInfoById() {
        // Arrange
        Long videoId = 1L;
        Video video = new Video();
        video.setId(videoId);
        video.setTitle("Test Video");
        User user = new User();
        user.setUsername("testuser");
        video.setUser(user);

        when(videoRepository.findById(videoId)).thenReturn(Optional.of(video));

        // Act
        Map<String, Object> videoInfo = videoService.getVideoInfoById(videoId);

        // Assert
        assertNotNull(videoInfo);
        assertEquals(videoId, videoInfo.get("id"));
        assertEquals("Test Video", videoInfo.get("title"));
        assertEquals("testuser", videoInfo.get("user"));
    }

    @Test
    public void testGetAllVideosInfo() {
        // Arrange
        Video video1 = new Video();
        video1.setId(1L);
        video1.setTitle("Video 1");
        User user1 = new User();
        user1.setUsername("user1");
        video1.setUser(user1);

        Video video2 = new Video();
        video2.setId(2L);
        video2.setTitle("Video 2");
        User user2 = new User();
        user2.setUsername("user2");
        video2.setUser(user2);

        when(videoRepository.findAll()).thenReturn(Arrays.asList(video1, video2));

        // Act
        List<Map<String, Object>> videosInfo = videoService.getAllVideosInfo();

        // Assert
        assertEquals(2, videosInfo.size());
        assertEquals(1L, videosInfo.get(0).get("id"));
        assertEquals("Video 1", videosInfo.get(0).get("title"));
        assertEquals("user1", videosInfo.get(0).get("user"));
        assertEquals(2L, videosInfo.get(1).get("id"));
        assertEquals("Video 2", videosInfo.get(1).get("title"));
        assertEquals("user2", videosInfo.get(1).get("user"));
    }

    @Test
    public void testGetCommentsById() {
        // Arrange
        Long videoId = 1L;
        Video video = getVideo(videoId);

        when(videoRepository.findById(videoId)).thenReturn(Optional.of(video));

        // Act
        List<Map<String, Object>> comments = videoService.getCommentsById(videoId);

        // Assert
        assertEquals(2, comments.size());
        assertEquals(1L, comments.get(0).get("id"));
        assertEquals("Comment 1", comments.get(0).get("text"));
        assertEquals("user1", comments.get(0).get("author"));
        assertEquals(2L, comments.get(1).get("id"));
        assertEquals("Comment 2", comments.get(1).get("text"));
        assertEquals("user2", comments.get(1).get("author"));
    }

    private static Video getVideo(Long videoId) {
        Video video = new Video();
        video.setId(videoId);

        Comment comment1 = new Comment();
        comment1.setId(1L);
        comment1.setText("Comment 1");
        User user1 = new User();
        user1.setUsername("user1");
        comment1.setUser(user1);

        Comment comment2 = new Comment();
        comment2.setId(2L);
        comment2.setText("Comment 2");
        User user2 = new User();
        user2.setUsername("user2");
        comment2.setUser(user2);

        video.setComments(Arrays.asList(comment1, comment2));
        return video;
    }

    @Test
    public void testUpdateLikeStatus() {
        // Arrange
        Long videoId = 1L;
        Video video = new Video();
        video.setId(videoId);
        video.setLikes(0);
        video.setDislikes(0);

        when(videoRepository.findById(videoId)).thenReturn(Optional.of(video));

        // Act
        videoService.updateLikeStatus(videoId, true);

        // Assert
        assertEquals(1, video.getLikes());
        assertEquals(0, video.getDislikes());

        // Act
        videoService.updateLikeStatus(videoId, false);

        // Assert
        assertEquals(1, video.getLikes());
        assertEquals(1, video.getDislikes());
    }

    @Test
    public void testAddCommentById() {
        // Arrange
        Long videoId = 1L;
        String text = "New Comment";
        String username = "testuser";

        Video video = new Video();
        video.setId(videoId);

        User user = new User();
        user.setUsername(username);

        when(videoRepository.findById(videoId)).thenReturn(Optional.of(video));
        when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));
        // Act
        boolean result = videoService.addCommentById(videoId, text, username);

        // Assert
        assertTrue(result);
        verify(commentRepository, times(1)).save(any(Comment.class));
    }

    @Test
    public void testUploadVideoInfo() throws Exception {
        // Arrange
        String title = "Test Title";
        String description = "Test Description";
        String category = "Test Category";
        String username = "testuser";

        User user = new User();
        user.setUsername(username);

        Category videoCategory = new Category();
        videoCategory.setName(category);

        when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));
        when(categoryRepository.findByName(category)).thenReturn(Optional.of(videoCategory));

        Video video = new Video();
        video.setId(1L);
        when(videoRepository.save(any(Video.class))).thenAnswer(invocation -> {
            Video v = invocation.getArgument(0);
            v.setId(1L);
            return v;
        });

        // Act
        Long videoId = videoService.uploadVideoInfo(title, description, category, username);

        // Assert
        assertNotNull(videoId);
        assertEquals(0L, videoId); // Since the method returns newVideo.getId() - 1
        verify(videoRepository, times(1)).save(any(Video.class));
    }

    @Test
    public void testEditVideoById() {
        // Arrange
        Long videoId = 1L;
        String title = "New Title";
        String description = "New Description";
        String category = "New Category";

        Video video = new Video();
        video.setId(videoId);
        video.setTitle("Old Title");
        video.setDescription("Old Description");

        Category videoCategory = new Category();
        videoCategory.setName(category);

        when(videoRepository.findById(videoId)).thenReturn(Optional.of(video));
        when(categoryRepository.findByName(category)).thenReturn(Optional.of(videoCategory));

        // Act
        boolean result = videoService.editVideoById(videoId, title, description, category);

        // Assert
        assertTrue(result);
        assertEquals(title, video.getTitle());
        assertEquals(description, video.getDescription());
        assertEquals(videoCategory, video.getCategory());
    }

    @Test
    public void testGetVideoDetailsById() {
        // Arrange
        Long videoId = 1L;
        Video video = new Video();
        video.setId(videoId);
        video.setTitle("Test Title");
        video.setDescription("Test Description");
        Category category = new Category();
        category.setName("Test Category");
        video.setCategory(category);

        when(videoRepository.findById(videoId)).thenReturn(Optional.of(video));

        // Act
        Map<String, Object> videoDetails = videoService.getVideoDetailsById(videoId);

        // Assert
        assertNotNull(videoDetails);
        assertEquals("Test Title", videoDetails.get("title"));
        assertEquals("Test Description", videoDetails.get("description"));
        assertEquals("Test Category", videoDetails.get("category"));
    }

}