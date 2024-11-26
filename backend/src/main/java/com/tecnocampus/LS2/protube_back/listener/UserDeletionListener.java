package com.tecnocampus.LS2.protube_back.listener;

import com.tecnocampus.LS2.protube_back.domain.User;
import com.tecnocampus.LS2.protube_back.domain.Video;
import com.tecnocampus.LS2.protube_back.service.VideoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class UserDeletionListener {

    private static VideoService videoService;

    @Autowired
    public void setVideoService(VideoService videoService) {
        UserDeletionListener.videoService = videoService;
    }

    public static void deleteUserFiles(User user) {
        for (Video video : user.getVideos()) {
            videoService.deleteVideoFiles(video.getId());
        }
    }
}