package com.tecnocampus.LS2.protube_back.controller;

import com.tecnocampus.LS2.protube_back.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @PostMapping("/{id}/like")
    public ResponseEntity<Void> updateLikeStatus(@PathVariable Long id, @RequestParam boolean isLike) {
        commentService.updateLikeStatus(id, isLike);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/{id}/edit")
    public ResponseEntity<String> editCommentById(@PathVariable Long id, @RequestParam String text) {
        boolean success = commentService.editCommentById(id, text);
        if (success) {
            return new ResponseEntity<>("Comment edited successfully!", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Failed to edit comment.", HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/{id}/text")
    public ResponseEntity<String> getCommentTextById(@PathVariable Long id) {
        Optional<String> commentText = commentService.getCommentTextById(id);
        return commentText.map(s ->
                new ResponseEntity<>(s, HttpStatus.OK)).orElseGet(() ->
                new ResponseEntity<>("Comment not found.", HttpStatus.NOT_FOUND));
    }
}