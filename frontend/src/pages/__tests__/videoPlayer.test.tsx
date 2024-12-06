import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import VideoPlayer from "../video-player/videoPlayer";

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe("VideoPlayer Component", () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it("renders loading spinner initially", () => {
    render(
      <MemoryRouter initialEntries={["/videos/1"]}>
        <Routes>
          <Route path="/videos/:videoId" element={<VideoPlayer />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("renders video data and comments", async () => {
    const mockVideoData = {
      title: "Test Video",
      description: "This is a test video description",
      likes: 10,
      dislikes: 2,
      tags: ["test", "video"]
    };
    const mockComments = [
      { author: "User1", text: "Great video!", avatarColor: "#ff0000" }
    ];
    const mockVideoBlob = new Blob(["video content"], { type: "video/mp4" });

    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => mockVideoData });
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => mockComments });
    mockFetch.mockResolvedValueOnce({ ok: true, blob: async () => mockVideoBlob });

    render(
      <MemoryRouter initialEntries={["/videos/1"]}>
        <Routes>
          <Route path="/videos/:videoId" element={<VideoPlayer />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText("Test Video")).toBeInTheDocument());
    expect(screen.getByText("This is a test video description")).toBeInTheDocument();
    expect(screen.getByText("Great video!")).toBeInTheDocument();
  });

  it("handles like and dislike actions", async () => {
    const mockVideoData = {
      title: "Test Video",
      description: "This is a test video description",
      likes: 10,
      dislikes: 2,
      tags: ["test", "video"]
    };
    const mockComments: Array<{ author: string; text: string; avatarColor: string }> = [];
    const mockVideoBlob = new Blob(["video content"], { type: "video/mp4" });

    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => mockVideoData });
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => mockComments });
    mockFetch.mockResolvedValueOnce({ ok: true, blob: async () => mockVideoBlob });

    render(
      <MemoryRouter initialEntries={["/videos/1"]}>
        <AuthContext.Provider value={{ user: "testUser", login: jest.fn(), logout: jest.fn() }}>
          <Routes>
            <Route path="/videos/:videoId" element={<VideoPlayer />} />
          </Routes>
        </AuthContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText("Test Video")).toBeInTheDocument());

    fireEvent.click(screen.getByRole("button", { name: /thumb up/i }));
    await waitFor(() => expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining("/like?isLike=true"), expect.any(Object)));

    fireEvent.click(screen.getByRole("button", { name: /thumb down/i }));
    await waitFor(() => expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining("/like?isLike=false"), expect.any(Object)));
  });

  it("handles adding a comment", async () => {
    const mockVideoData = {
      title: "Test Video",
      description: "This is a test video description",
      likes: 10,
      dislikes: 2,
      tags: ["test", "video"]
    };
    const mockComments: Array<{ author: string; text: string; avatarColor: string }> = [];
    const mockVideoBlob = new Blob(["video content"], { type: "video/mp4" });

    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => mockVideoData });
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => mockComments });
    mockFetch.mockResolvedValueOnce({ ok: true, blob: async () => mockVideoBlob });

    render(
      <MemoryRouter initialEntries={["/videos/1"]}>
        <AuthContext.Provider value={{ user: "testUser", login: jest.fn(), logout: jest.fn() }}>
          <Routes>
            <Route path="/videos/:videoId" element={<VideoPlayer />} />
          </Routes>
        </AuthContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText("Test Video")).toBeInTheDocument());

    fireEvent.change(screen.getByPlaceholderText("Write a comment..."), { target: { value: "Nice video!" } });
    fireEvent.click(screen.getByText("Add Comment"));

    await waitFor(() => expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining("/addComment"), expect.any(Object)));
    expect(screen.getByText("Nice video!")).toBeInTheDocument();
  });
});