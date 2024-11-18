package com.tecnocampus.LS2.protube_back.controller;

import com.tecnocampus.LS2.protube_back.domain.User;
import com.tecnocampus.LS2.protube_back.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestParam String username, @RequestParam String password) {
        Optional<User> existingUser = userService.verifyNewUser(username);
        if (existingUser.isPresent()) {
            return new ResponseEntity<>("Username already exists.", HttpStatus.CONFLICT);
        }

        userService.registerUser(username, password);
        return new ResponseEntity<>("User registered successfully!", HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestParam String username, @RequestParam String password) {
        Optional<User> user = userService.verifyUser(username, password);
        if (user.isPresent()) {
            return new ResponseEntity<>("User logged in successfully!", HttpStatus.OK);
        }
        return new ResponseEntity<>("Invalid credentials.", HttpStatus.UNAUTHORIZED);
    }

    @GetMapping("/{username}/comments")
    public ResponseEntity<List<Map<String, Object>>> getAllCommentsByUsername(@PathVariable String username) {
        List<Map<String, Object>> comments = userService.getAllCommentsByUsername(username);
        return new ResponseEntity<>(comments, HttpStatus.OK);
    }

    @GetMapping("/{username}/videos")
    public ResponseEntity<List<Map<String, String>>> getAllVideosByUsername(@PathVariable String username) {
        List<Map<String, String>> comments = userService.getAllVideosByUsername(username);
        return new ResponseEntity<>(comments, HttpStatus.OK);
    }
}
