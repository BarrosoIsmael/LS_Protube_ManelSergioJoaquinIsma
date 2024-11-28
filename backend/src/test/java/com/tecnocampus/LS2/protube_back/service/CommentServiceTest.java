package com.tecnocampus.LS2.protube_back.service;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import com.tecnocampus.LS2.protube_back.domain.Comment;
import com.tecnocampus.LS2.protube_back.repository.CommentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

public class CommentServiceTest {

    @Mock
    private CommentRepository commentRepository;

    @InjectMocks
    private CommentService commentService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testEditCommentById() {
        // Arrange
        Long commentId = 1L;
        String newText = "Updated Comment";
        Comment comment = new Comment();
        comment.setId(commentId);
        comment.setText("Old Comment");

        when(commentRepository.findById(commentId)).thenReturn(Optional.of(comment));

        // Act
        boolean result = commentService.editCommentById(commentId, newText);

        // Assert
        assertTrue(result);
        assertEquals(newText, comment.getText());
    }

    @Test
    public void testGetContentById() {
        // Arrange
        Long commentId = 1L;
        Comment comment = new Comment();
        comment.setId(commentId);
        comment.setText("Test Comment");

        when(commentRepository.findById(commentId)).thenReturn(Optional.of(comment));

        // Act
        Optional<String> result = commentService.getContentById(commentId);

        // Assert
        assertTrue(result.isPresent());
        assertEquals("Test Comment", result.get());
    }

    @Test
    public void testDeleteCommentById() {
        // Arrange
        Long commentId = 1L;

        when(commentRepository.existsById(commentId)).thenReturn(true);

        // Act
        boolean result = commentService.deleteCommentById(commentId);

        // Assert
        assertTrue(result);
        verify(commentRepository, times(1)).deleteById(commentId);
    }
}