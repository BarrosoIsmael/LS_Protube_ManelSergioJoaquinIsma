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

    @Column(nullable = false)
    private int likes;

    public Comment() {
    }

    public Comment(Video video, String text, User user) {
        this.video = video;
        this.text = text;
        this.user = user;
        this.likes = 0;
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

    public int getLikes() {
        return likes;
    }

    public void setLikes(int likes) {
        this.likes = likes;
    }

    public void addLike() {
        this.likes++;
    }

    public void addDislike() {
        this.likes--;
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