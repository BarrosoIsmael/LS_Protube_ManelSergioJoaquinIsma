package com.tecnocampus.LS2.protube_back;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tecnocampus.LS2.protube_back.domain.Category;
import com.tecnocampus.LS2.protube_back.domain.Comment;
import com.tecnocampus.LS2.protube_back.domain.User;
import com.tecnocampus.LS2.protube_back.domain.Video;
import com.tecnocampus.LS2.protube_back.repository.CategoryRepository;
import com.tecnocampus.LS2.protube_back.repository.CommentRepository;
import com.tecnocampus.LS2.protube_back.repository.UserRepository;
import com.tecnocampus.LS2.protube_back.repository.VideoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;
import java.util.Comparator;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.util.List;
import java.util.stream.Stream;

@Component
public class AppStartupRunner implements ApplicationRunner {
    private static final Logger LOG = LoggerFactory.getLogger(AppStartupRunner.class);

    @Value("${pro_tube.store.dir}")
    private String videoDirectory;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VideoRepository videoRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    private final Environment env;
    private final Path rootPath;
    private final Boolean loadInitialData;
    @Autowired
    private ObjectMapper objectMapper;

    public AppStartupRunner(Environment env) {
        this.env = env;
        final var rootDir = env.getProperty("pro_tube.store.dir");
        this.rootPath = Paths.get(rootDir);
        loadInitialData = env.getProperty("pro_tube.load_initial_data", Boolean.class);
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {
        loadInitialJSONData();
    }

    private void loadInitialJSONData() throws IOException {
        Path videoDirPath = Paths.get(videoDirectory);

        if (!Files.exists(videoDirPath) || !Files.isDirectory(videoDirPath)) {
            throw new IOException("Directorio de videos no encontrado o no es un directorio válido: " + videoDirectory);
        }

        try (Stream<Path> paths = Files.walk(videoDirPath)) {
            List<Path> sortedPaths = paths.filter(Files::isRegularFile)
                    .sorted()
                    .toList();
            for (Path path : sortedPaths) {
                processJsonFile(path);
            }
        }
    }

    private void processJsonFile(Path filePath) {
        try {
            String jsonContent = Files.readString(filePath, StandardCharsets.UTF_8);
            VideoJson videoJson = objectMapper.readValue(jsonContent, VideoJson.class);
            saveVideoData(videoJson);
            System.out.println("Video data saved: " + videoJson.getTitle());
        } catch (JsonParseException e) {
            System.err.println("Invalid JSON format: " + e.getMessage());
        } catch (IOException e) {
            System.err.println("Error reading file: " + e.getMessage());
        }
    }

    private void saveVideoData(VideoJson videoJson) {
        // Create or find the user
        User user = userRepository.findByUsername(videoJson.getUser())
                .orElseGet(() -> {
                    User newUser = new User(videoJson.getUser(), "0000");
                    userRepository.save(newUser);
                    return newUser;
                });

        // Create or find the category
        Category category = categoryRepository.findByName(videoJson.getMeta().getCategories().get(0))
                .orElseGet(() -> {
                    Category newCategory = new Category(videoJson.getMeta().getCategories().get(0));
                    categoryRepository.save(newCategory);
                    return newCategory;
                });

        // Create the video
        Video video = new Video(videoJson.getWidth(), videoJson.getHeight(), videoJson.getDuration(),
                videoJson.getTitle(), user, videoJson.getMeta().getDescription(), videoJson.getMeta().getTags(), category);
        //video.setId(videoJson.getId());
        videoRepository.save(video);

        // Create comments
        if (videoJson.getMeta().getComments() != null) {
            for (VideoJson.CommentJson commentJson : videoJson.getMeta().getComments()) {
                User commentUser = userRepository.findByUsername(commentJson.getAuthor())
                        .orElseGet(() -> {
                            User newUser = new User(commentJson.getAuthor(), "0000");
                            userRepository.save(newUser);
                            return newUser;
                        });

                Comment comment = new Comment(video, commentJson.getText(), commentUser);
                commentRepository.save(comment);
            }
        }
    }
}