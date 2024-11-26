package com.tecnocampus.LS2.protube_back.domain;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "videos")
public class Video {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(length = 8192)
    private String description;

    @ElementCollection
    private List<String> tags;

    @OneToMany(mappedBy = "video")
    private List<Comment> comments;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @Column(nullable = false)
    private int likes;

    @Column(nullable = false)
    private int dislikes;

    public Video() {
    }

    public Video(String title, User user, String description, List<String> tags, Category category) {
        this.title = title;
        this.user = user;
        this.description = description;
        this.tags = tags;
        this.category = category;
        this.likes = 0;
        this.dislikes = 0;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public List<Comment> getComments() {
        return comments;
    }

    public void setComments(List<Comment> comments) {
        this.comments = comments;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public int getLikes() {
        return likes;
    }

    public void setLikes(int likes) {
        this.likes = likes;
    }

    public int getDislikes() {
        return dislikes;
    }

    public void setDislikes(int dislikes) {
        this.dislikes = dislikes;
    }

    public void addComment(Comment comment) {
        this.comments.add(comment);
    }

    public void addTag(String tag) {
        this.tags.add(tag);
    }

    public void removeComment(Comment comment) {
        this.comments.remove(comment);
    }

    public void addLike() {
        this.likes++;
    }

    public void addDislike() {
        this.dislikes++;
    }

    @Override
    public String toString() {
        return "Video{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", user=" + user +
                ", description='" + description + '\'' +
                ", tags=" + tags +
                ", comments=" + comments +
                ", category=" + category +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Video video = (Video) o;

        return id != null ? id.equals(video.id) : video.id == null;
    }
}