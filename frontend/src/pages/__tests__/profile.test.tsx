import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AuthContext } from "../../context/AuthContext";
import Profile from "../profile/profile";

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe("Profile Component", () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it("renders user information", async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => [] }); // Videos
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => [] }); // Comments

    render(
      <AuthContext.Provider value={{ user: "testUser", login: jest.fn(), logout: jest.fn() }}>
        <Profile />
      </AuthContext.Provider>
    );

    expect(screen.getByText("My Profile")).toBeInTheDocument();
    expect(screen.getByText("Username: testUser")).toBeInTheDocument();
  });

  it("displays uploaded videos", async () => {
    const mockVideos = [{ id: 1, title: "Video 1" }];
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => mockVideos });
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => [] });

    render(
      <AuthContext.Provider value={{ user: "testUser", login: jest.fn(), logout: jest.fn() }}>
        <Profile />
      </AuthContext.Provider>
    );

    await waitFor(() => expect(screen.getByText("Uploaded Videos")).toBeInTheDocument());
    expect(screen.getByText("Video 1")).toBeInTheDocument();
  });

  it("handles delete video action", async () => {
    const mockVideos = [{ id: 1, title: "Video 1" }];
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => mockVideos });
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => [] });

    render(
      <AuthContext.Provider value={{ user: "testUser", login: jest.fn(), logout: jest.fn() }}>
        <Profile />
      </AuthContext.Provider>
    );

    const deleteButton = await screen.findByRole("button", { name: /delete/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/videos"),
        expect.objectContaining({ method: "DELETE" })
      );
    });
  });

  it("displays and handles comments", async () => {
    const mockComments = [{ id: 1, content: "Comment 1" }];
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => [] });
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => mockComments });

    render(
      <AuthContext.Provider value={{ user: "testUser", login: jest.fn(), logout: jest.fn() }}>
        <Profile />
      </AuthContext.Provider>
    );

    await waitFor(() => expect(screen.getByText("My Comments")).toBeInTheDocument());
    expect(screen.getByText("Comment 1")).toBeInTheDocument();
  });
});
