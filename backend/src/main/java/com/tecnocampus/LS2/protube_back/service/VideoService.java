package com.tecnocampus.LS2.protube_back.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class VideoService {

    @Value("${pro_tube.store.dir}")
    private String videoDirectory;

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

}