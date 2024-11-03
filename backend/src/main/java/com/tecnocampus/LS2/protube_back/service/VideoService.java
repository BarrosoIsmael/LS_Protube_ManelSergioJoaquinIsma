package com.tecnocampus.LS2.protube_back.service;

import com.tecnocampus.LS2.protube_back.domain.Video;
import com.tecnocampus.LS2.protube_back.repository.VideoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.io.IOException;

@Service
public class VideoService {

    @Value("${pro_tube.store.dir}")
    private String videoDirectory;

    @Autowired
    private VideoRepository videoRepository;

    public List<String> getAllVideos() throws IOException {
        Path videoDirPath = Paths.get(videoDirectory);

        if (!Files.exists(videoDirPath) || !Files.isDirectory(videoDirPath)) {
            throw new IOException("Directorio de videos no encontrado o no es un directorio válido: " + videoDirectory);
        }

        try (Stream<Path> paths = Files.walk(videoDirPath)) {
            return paths
                    .filter(Files::isRegularFile)
                    .map(Path::toString)
                    .collect(Collectors.toList());
        }
    }

    public byte[] getMiniatureById(Long id) throws IOException {
        // Ruta donde se almacenan las miniaturas
        Path path = Paths.get(videoDirectory, id + ".webp");
        return Files.readAllBytes(path);
    }

    public Optional<Video> getVideoInfoById(Long id) {
        return videoRepository.findById(id);
    }

}