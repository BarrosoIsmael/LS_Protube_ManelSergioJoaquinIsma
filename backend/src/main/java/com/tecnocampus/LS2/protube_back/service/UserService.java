package com.tecnocampus.LS2.protube_back.service;

import com.tecnocampus.LS2.protube_back.domain.User;
import com.tecnocampus.LS2.protube_back.repository.CommentRepository;
import com.tecnocampus.LS2.protube_back.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final CommentRepository commentRepository;

    @Autowired
    public UserService(UserRepository userRepository, CommentRepository commentRepository) {
        this.userRepository = userRepository;
        this.commentRepository = commentRepository;
    }

    public void registerUser(String username, String password) {
        User user = new User();
        user.setUsername(username);
        user.setPassword(password);
        userRepository.save(user);
    }

    public Optional<User> verifyUser(String username, String password) {
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isPresent() && user.get().getPassword().equals(password)) {
            return user;
        }
        return Optional.empty();
    }

    public Optional<User> verifyNewUser(String username) {
        return userRepository.findByUsername(username);
    }

    public List<Map<String, String>> getAllCommentsByUsername(String username) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isPresent()) {
            Long userId = userOpt.get().getId();
            return commentRepository.findByUserId(userId).stream().map(comment -> {
                Map<String, String> commentInfo = new HashMap<>();
                commentInfo.put("text", comment.getText());
                commentInfo.put("username", comment.getUser().getUsername());
                return commentInfo;
            }).collect(Collectors.toList());
        }
        return List.of();
    }
}
