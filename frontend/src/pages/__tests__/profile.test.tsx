import { render, screen, waitFor, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Profile from "../profile/profile";
import { AuthContext } from "../../context/AuthContext";

// Mock for the fetch function
global.fetch = jest.fn((url) => {
  if (url.includes("/videos")) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve([{ id: 1, title: "Test Video" }]),
    });
  }
  if (url.includes("/comments")) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve([{ id: 1, text: "Test Comment" }]),
    });
  }
  if (url.includes("/comment-text")) {
    return Promise.resolve({
      ok: true,
      text: () => Promise.resolve("Test Comment Text"),
    });
  }
  return Promise.reject("Unknown URL");
}) as jest.Mock;

describe("Profile Component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should display user information, videos, and comments", async () => {
    render(
      <AuthContext.Provider value={{ user: "testuser", login: jest.fn(), logout: jest.fn() }}>
        <MemoryRouter>
          <Routes>
            <Route path="/" element={<Profile />} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    );

    expect(screen.getByText("My Profile")).toBeInTheDocument();
    expect(screen.getByText("User information")).toBeInTheDocument();
    expect(screen.getByText("Username: testuser")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Test Video")).toBeInTheDocument();
      expect(screen.getByText("Test Comment")).toBeInTheDocument();
    });
  });

  it("should handle edit and delete actions for videos and comments", async () => {
    render(
      <AuthContext.Provider value={{ user: "testuser", login: jest.fn(), logout: jest.fn() }}>
        <MemoryRouter>
          <Routes>
            <Route path="/" element={<Profile />} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText("Test Video")).toBeInTheDocument();
      expect(screen.getByText("Test Comment")).toBeInTheDocument();
    });

    // Simulate the action of deleting a video
    await act(async () => {
      fireEvent.click(screen.getAllByTestId("DeleteIcon")[0]);
    });

    // Simulate the action of editing a comment
    await act(async () => {
      fireEvent.click(screen.getAllByTestId("EditIcon")[1]);
    });

    await waitFor(() => {
      expect(screen.getByText((content) => content.includes("Edit Comment"))).toBeInTheDocument();
    });
  });
});