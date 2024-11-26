import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./UploadVideo.css";

const UploadVideo: React.FC = () => {
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [uploadStatus, setUploadStatus] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !title || !description || !category || !user) {
      setUploadStatus("Please fill out all fields and select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("username", user);

    try {
      setUploadStatus("Uploading video metadata...");

      // Primero, subimos los metadatos del video
      const metadataResponse = await fetch("/api/videos/uploadNewVideo", {
        method: "POST",
        body: formData,
      });

      if (!metadataResponse.ok) {
        setUploadStatus("Failed to upload video metadata.");
        return;
      }

      setUploadStatus("Uploading video file...");

      // Luego, subimos el archivo de video
      const fileFormData = new FormData();
      fileFormData.append("file", selectedFile);

      const fileResponse = await fetch("/api/videos/uploadVideo", {
        method: "POST",
        body: fileFormData,
      });

      if (fileResponse.ok) {
        setUploadStatus("Video uploaded successfully!");
      } else {
        setUploadStatus("Failed to upload video.");
      }
    } catch (error) {
      console.error("Error uploading the video:", error);
      setUploadStatus("An error occurred during the upload.");
    }
  };

  return (
    <div className="upload-video-container">
      <h2>Upload a Video</h2>
      <form>
        <label>
          Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>
        <label>
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>
        <label>
          Category:
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </label>
        <label>
          Video File:
          <div className="custom-file-upload">
            <button
              type="button"
              onClick={() => document.getElementById("fileInput")?.click()}
            >
              Select File
            </button>
            <span>{selectedFile ? selectedFile.name : "No file selected"}</span>
          </div>
          <input
            id="fileInput"
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </label>
        <button type="button" onClick={handleUpload}>
          Upload
        </button>
      </form>
      {uploadStatus && (
        <p
          className={
            uploadStatus.startsWith("Error") || uploadStatus.startsWith("Failed")
              ? "upload-error"
              : "upload-status"
          }
        >
          {uploadStatus}
        </p>
      )}
    </div>
  );
};

export default UploadVideo;
