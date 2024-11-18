import React, { useState } from "react";
import axios from "axios";

const UploadVideo: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setUploadStatus("Uploading...");
      const response = await axios.post("/api/videos/uploadVideo", formData, {
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
    <div>
      <h2>Upload a Video</h2>
      <input type="file" accept="video/*" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {uploadStatus && <p>{uploadStatus}</p>}
    </div>
  );
};

export default UploadVideo;
