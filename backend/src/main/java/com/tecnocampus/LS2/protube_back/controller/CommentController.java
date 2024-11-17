package com.tecnocampus.LS2.protube_back.controller;

import com.tecnocampus.LS2.protube_back.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
}