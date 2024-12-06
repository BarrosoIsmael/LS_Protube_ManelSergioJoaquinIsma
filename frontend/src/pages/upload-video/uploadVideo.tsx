import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Button, CircularProgress } from "@mui/material";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ImageIcon from '@mui/icons-material/Image';
import { useNavigate } from "react-router-dom";
import "./uploadVideo.css";
import { getEnv } from "../../utils/Env";

const UploadVideo: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleThumbnailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setThumbnailFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !thumbnailFile || !title || !description || !category.trim() || !user) {
      setUploadStatus("Error: Please fill out all fields, and select files to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("username", user);
    formData.append("videoFile", selectedFile);
    formData.append("imageFile", thumbnailFile);

    try {
      setIsLoading(true);
      setUploadStatus("Uploading video and thumbnail...");

      const response = await fetch(getEnv().API_BASE_URL + "/videos/uploadVideo", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setUploadStatus(await response.text());
        navigate("/profile");
      } else {
        setUploadStatus("Failed: " + await response.text());
      }
    } catch (error) {
      console.error("Error uploading the video and thumbnail:", error);
      setUploadStatus("Error: An error occurred during the upload.");
    } finally {
      setIsLoading(false);
    }
  };

  const truncateFileName = (fileName: string) => {
    const maxLength = 20;
    if (fileName.length > maxLength) {
      const extension = fileName.slice(fileName.lastIndexOf('.'));
      return ` ${fileName.slice(0, 10)}...${extension}`;
    }
    return ` ${fileName}`;
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
            className={!category.trim() ? "input-error" : ""}
          />
        </label>
        <label>
          Video File (100MB max):
          <div className="custom-file-upload">
            <Button
              variant="contained"
              startIcon={<UploadFileIcon />}
              onClick={() => document.getElementById("fileInput")?.click()}
            >
              Select File
            </Button>
            <span className="file-name">{selectedFile ? truncateFileName(selectedFile.name) : " No file selected"}</span>
          </div>
          <input
            id="fileInput"
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
        
        <label>
          Thumbnail File (100MB max):
          <div className="custom-min-upload">
            <Button
              variant="contained"
              startIcon={<ImageIcon />}
              onClick={() => document.getElementById("thumbnailInput")?.click()}
            >
              Select Thumbnail
            </Button>
            <span className="file-name">{thumbnailFile ? truncateFileName(thumbnailFile.name) : " No file selected"}</span>
          </div>
          <input
            id="thumbnailInput"
            type="file"
            accept="image/*"
            onChange={handleThumbnailChange}
            className="hidden"
          />
        </label>
        
        <div className="custom-send-upload">
            <div className="centered-container">
            {isLoading ? (
              <CircularProgress />
            ) : (
              <Button variant="contained" color="primary" onClick={handleUpload}>
              Upload Video
              </Button>
            )}
            </div>
        </div>
      </form>
      {uploadStatus && (
        <p
          role="alert"
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
