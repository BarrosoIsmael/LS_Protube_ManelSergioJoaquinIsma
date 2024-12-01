import React, { useState, useEffect } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from "@mui/material";
import { getEnv } from "../../utils/Env";

interface EditVideoDialogProps {
  open: boolean;
  videoId: number;
  onClose: () => void;
  onUpdate: () => void;
}

const EditVideoDialog: React.FC<EditVideoDialogProps> = ({ open, videoId, onClose, onUpdate }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        const response = await fetch(getEnv().API_BASE_URL + `/videos/${videoId}/details`);
        if (response.ok) {
          const data = await response.json();
          setTitle(data.title);
          setDescription(data.description);
          setCategory(data.category);
        }
      } catch (error) {
        console.error("Error fetching video details:", error);
      }
    };

    if (open) {
      fetchVideoDetails();
    }
  }, [open, videoId]);

  const handleUpdateVideo = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    try {
      const response = await fetch(getEnv().API_BASE_URL + `/videos/${videoId}/edit`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        onUpdate();
        onClose();
      }
    } catch (error) {
      console.error("Error updating video:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Editar Video</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Title"
          type="text"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Description"
          type="text"
          fullWidth
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Category"
          type="text"
          fullWidth
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleUpdateVideo}>Update video</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditVideoDialog;