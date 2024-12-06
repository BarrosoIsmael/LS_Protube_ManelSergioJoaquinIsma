import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import VideoPlayer from "../video-player/videoPlayer";
import { AuthContext } from "../../context/AuthContext";

// Mock for the fetch function
global.fetch = jest.fn((url) => {
  if (url.includes("/videos/1")) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        id: 1,
        title: "Test Video",
        description: "Test Description",
        likes: 10,
        dislikes: 2,
        tags: ["test", "video"]
      }),
    });
  }
  if (url.includes("/videos/1/comments")) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve([
        { author: "User1", text: "Test Comment 1", avatarColor: "#ff0000" },
        { author: "User2", text: "Test Comment 2", avatarColor: "#00ff00" }
      ]),
    });
  }
  if (url.includes("/videos/video/1")) {
    return Promise.resolve({
      ok: true,
      blob: () => Promise.resolve(new Blob(["Test Video Content"], { type: "video/mp4" })),
    });
  }
  return Promise.reject("Unknown URL");
}) as jest.Mock;

describe("VideoPlayer Component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should handle like and dislike actions", async () => {
    await act(async () => {
      render(
        <AuthContext.Provider value={{ user: "testuser", login: jest.fn(), logout: jest.fn() }}>
          <MemoryRouter initialEntries={["/videos/1"]}>
            <Routes>
              <Route path="/videos/:videoId" element={<VideoPlayer />} />
            </Routes>
          </MemoryRouter>
        </AuthContext.Provider>
      );
    });

    const likeButton = screen.getByText("10");
    const dislikeButton = screen.getByText("2");

    fireEvent.click(likeButton);
    await waitFor(() => {
      expect(screen.getByText("11")).toBeInTheDocument();
    });

    fireEvent.click(dislikeButton);
    await waitFor(() => {
      expect(screen.getByText("3")).toBeInTheDocument();
    });
  });

  it("should add a new comment", async () => {
    await act(async () => {
      render(
        <AuthContext.Provider value={{ user: "testuser", login: jest.fn(), logout: jest.fn() }}>
          <MemoryRouter initialEntries={["/videos/1"]}>
            <Routes>
              <Route path="/videos/:videoId" element={<VideoPlayer />} />
            </Routes>
          </MemoryRouter>
        </AuthContext.Provider>
      );
    });

    fireEvent.change(screen.getByPlaceholderText("Write a comment..."), {
      target: { value: "New Test Comment" },
    });
    fireEvent.click(screen.getByText("Add Comment"));

    await waitFor(() => {
      expect(screen.getByText("New Test Comment")).toBeInTheDocument();
    });
  });
});