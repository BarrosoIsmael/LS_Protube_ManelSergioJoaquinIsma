package com.tecnocampus.LS2.protube_back.service;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import com.tecnocampus.LS2.protube_back.domain.Comment;
import com.tecnocampus.LS2.protube_back.domain.User;
import com.tecnocampus.LS2.protube_back.domain.Video;
import com.tecnocampus.LS2.protube_back.repository.CommentRepository;
import com.tecnocampus.LS2.protube_back.repository.UserRepository;
import com.tecnocampus.LS2.protube_back.repository.VideoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private VideoRepository videoRepository;

    @Mock
    private CommentRepository commentRepository;

    @InjectMocks
    private UserService userService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testRegisterUser() {
        // Arrange
        String username = "testuser";
        String password = "password";

        // Act
        userService.registerUser(username, password);

        // Assert
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    public void testVerifyUser() {
        // Arrange
        String username = "testuser";
        String password = "password";
        User user = new User();
        user.setUsername(username);
        user.setPassword(password);

        when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));

        // Act
        Optional<User> result = userService.verifyUser(username, password);

        // Assert
        assertTrue(result.isPresent());
        assertEquals(username, result.get().getUsername());
    }

    @Test
    public void testVerifyNewUser() {
        // Arrange
        String username = "newuser";

        when(userRepository.findByUsername(username)).thenReturn(Optional.empty());

        // Act
        Optional<User> result = userService.verifyNewUser(username);

        // Assert
        assertFalse(result.isPresent());
    }

    @Test
    public void testGetAllCommentsByUsername() {
        // Arrange
        String username = "testuser";
        User user = new User();
        user.setUsername(username);
        user.setId(1L);

        Comment comment1 = new Comment();
        comment1.setId(1L);
        comment1.setText("Comment 1");
        comment1.setUser(user);

        Comment comment2 = new Comment();
        comment2.setId(2L);
        comment2.setText("Comment 2");
        comment2.setUser(user);

        when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));
        when(commentRepository.findByUserId(1L)).thenReturn(Arrays.asList(comment1, comment2));

        // Act
        List<Map<String, Object>> comments = userService.getAllCommentsByUsername(username);

        // Assert
        assertEquals(2, comments.size());
        assertEquals(1L, comments.get(0).get("id"));
        assertEquals("Comment 1", comments.get(0).get("text"));
        assertEquals("testuser", comments.get(0).get("user"));
        assertEquals(2L, comments.get(1).get("id"));
        assertEquals("Comment 2", comments.get(1).get("text"));
        assertEquals("testuser", comments.get(1).get("user"));
    }

    @Test
    public void testGetAllVideosByUsername() {
        // Arrange
        String username = "testuser";
        User user = new User();
        user.setUsername(username);
        user.setId(1L);

        Video video1 = new Video();
        video1.setId(1L);
        video1.setTitle("Video 1");
        video1.setUser(user);

        Video video2 = new Video();
        video2.setId(2L);
        video2.setTitle("Video 2");
        video2.setUser(user);

        when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));
        when(videoRepository.findByUserId(1L)).thenReturn(Arrays.asList(video1, video2));

        // Act
        List<Map<String, Object>> videos = userService.getAllVideosByUsername(username);

        // Assert
        assertEquals(2, videos.size());
        assertEquals(1L, videos.get(0).get("id"));
        assertEquals("Video 1", videos.get(0).get("title"));
        assertEquals(2L, videos.get(1).get("id"));
        assertEquals("Video 2", videos.get(1).get("title"));
    }

    @Test
    public void testDeleteUserByUsername() {
        // Arrange
        String username = "testuser";
        User user = new User();
        user.setUsername(username);

        when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));

        // Act
        userService.deleteUserByUsername(username);

        // Assert
        verify(userRepository, times(1)).delete(user);
    }
}
