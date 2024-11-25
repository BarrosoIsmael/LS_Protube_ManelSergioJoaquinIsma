package com.tecnocampus.LS2.protube_back.domain;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "comments")
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "video_id")
    private Video video;

    @Column(nullable = false, length = 8192)
    private String text;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public Comment() {
    }

    public Comment(Video video, String text, User user) {
        this.video = video;
        this.text = text;
        this.user = user;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Video getVideo() {
        return video;
    }

    public void setVideo(Video video) {
        this.video = video;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    @Override
    public String toString() {
        return "Comment{" +
                "id=" + id +
                ", video=" + video +
                ", text='" + text + '\'' +
                ", user=" + user +
                '}';
    }
}