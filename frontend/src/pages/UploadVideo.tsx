import React, { useState } from "react";
import axios from "axios";
import "./UploadVideo.css"; // Importa el CSS

const UploadVideo: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [uploadStatus, setUploadStatus] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !title || !description || !category || !username) {
      setUploadStatus("Please fill out all fields and select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("username", username);

    try {
      setUploadStatus("Uploading...");
      const response = await axios.post("/api/videos/uploadNewVideo", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 201) {
        setUploadStatus("Video uploaded successfully!");
      } else {
        setUploadStatus("Failed to upload the video.");
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
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <label>
          Video File:
          <input type="file" accept="video/*" onChange={handleFileChange} required />
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
