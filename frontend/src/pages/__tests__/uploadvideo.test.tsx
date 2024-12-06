import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AuthContext } from "../../context/AuthContext";
import UploadVideo from "../upload-video/uploadVideo";

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe("UploadVideo Component", () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it("renders the upload form", () => {
    render(
      <AuthContext.Provider value={{ user: "testUser", login: jest.fn(), logout: jest.fn() }}>
        <UploadVideo />
      </AuthContext.Provider>
    );

    expect(screen.getByText("Upload a Video")).toBeInTheDocument();
    expect(screen.getByLabelText("Title:")).toBeInTheDocument();
    expect(screen.getByLabelText("Description:")).toBeInTheDocument();
    expect(screen.getByLabelText("Category:")).toBeInTheDocument();
    expect(screen.getByLabelText("Video File:")).toBeInTheDocument();
    expect(screen.getByLabelText("Thumbnail File:")).toBeInTheDocument();
  });

  it("displays error message when missing required fields", async () => {
    render(
      <AuthContext.Provider value={{ user: "testUser", login: jest.fn(), logout: jest.fn() }}>
        <UploadVideo />
      </AuthContext.Provider>
    );

    fireEvent.click(screen.getByText("Upload Video"));

    expect(screen.getByText("Please fill out all fields, and select files to upload.")).toBeInTheDocument();
  });

  it("uploads video and thumbnail successfully", async () => {
    const mockVideoFile = new File(["video content"], "video.mp4", { type: "video/mp4" });
    const mockThumbnailFile = new File(["image content"], "thumbnail.jpg", { type: "image/jpeg" });
    mockFetch.mockResolvedValueOnce({ ok: true });

    render(
      <AuthContext.Provider value={{ user: "testUser", login: jest.fn(), logout: jest.fn() }}>
        <UploadVideo />
      </AuthContext.Provider>
    );

    fireEvent.change(screen.getByLabelText("Title:"), { target: { value: "Test Video" } });
    fireEvent.change(screen.getByLabelText("Description:"), { target: { value: "This is a test video" } });
    fireEvent.change(screen.getByLabelText("Category:"), { target: { value: "Test Category" } });

    fireEvent.change(screen.getByLabelText("Video File:"), { target: { files: [mockVideoFile] } });
    fireEvent.change(screen.getByLabelText("Thumbnail File:"), { target: { files: [mockThumbnailFile] } });

    fireEvent.click(screen.getByText("Upload Video"));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: "POST",
          body: expect.any(FormData),
        })
      );
      expect(screen.getByText("Video and thumbnail uploaded successfully!")).toBeInTheDocument();
    });
  });

  it("handles upload failure", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false });

    render(
      <AuthContext.Provider value={{ user: "testUser", login: jest.fn(), logout: jest.fn() }}>
        <UploadVideo />
      </AuthContext.Provider>
    );

    fireEvent.change(screen.getByLabelText("Title:"), { target: { value: "Test Video" } });
    fireEvent.change(screen.getByLabelText("Description:"), { target: { value: "This is a test video" } });
    fireEvent.change(screen.getByLabelText("Category:"), { target: { value: "Test Category" } });

    fireEvent.change(screen.getByLabelText("Video File:"), { target: { files: [new File(["video"], "video.mp4")] } });
    fireEvent.change(screen.getByLabelText("Thumbnail File:"), { target: { files: [new File(["image"], "thumbnail.jpg")] } });

    fireEvent.click(screen.getByText("Upload Video"));

    await waitFor(() => {
      expect(screen.getByText("Failed to upload video and thumbnail.")).toBeInTheDocument();
    });
  });
});
