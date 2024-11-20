package com.tecnocampus.LS2.protube_back.service;

import com.tecnocampus.LS2.protube_back.domain.Comment;
import com.tecnocampus.LS2.protube_back.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Transactional
    public boolean editCommentById(Long commentId, String text) {
        Optional<Comment> commentOpt = commentRepository.findById(commentId);
        if (commentOpt.isPresent()) {
            Comment comment = commentOpt.get();
            comment.setText(text);
            return true;
        }
        return false;
    }

    @Transactional
    public Optional<String> getCommentTextById(Long commentId) {
        Optional<Comment> commentOpt = commentRepository.findById(commentId);
        return commentOpt.map(Comment::getText);
    }
}