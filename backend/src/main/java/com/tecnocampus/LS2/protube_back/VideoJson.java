package com.tecnocampus.LS2.protube_back;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class VideoJson {
    private Long id;
    private int width;
    private int height;
    private float duration;
    private String title;
    private String user;
    private Meta meta;

    @Getter
    @Setter
    public static class Meta {
        private String description;
        private List<String> categories;
        private List<String> tags;
        private List<CommentJson> comments;
    }

    @Getter
    @Setter
    public static class CommentJson {
        private String text;
        private String author;
    }
}