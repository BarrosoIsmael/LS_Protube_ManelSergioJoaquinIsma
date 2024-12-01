import React from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from "@mui/material";
import { getEnv } from "../../utils/Env";

interface DeleteVideoDialogProps {
  open: boolean;
  videoId: number;
  onClose: () => void;
  onDelete: () => void;
}

const DeleteVideoDialog: React.FC<DeleteVideoDialogProps> = ({ open, videoId, onClose, onDelete }) => {

  const handleDeleteVideo = async () => {
    try {
      const response = await fetch(getEnv().API_BASE_URL + `/videos/${videoId}/delete`, {
        method: "DELETE",
      });

      if (response.ok) {
        onDelete();
        onClose();
      }
    } catch (error) {
      console.error("Error deleting video:", error);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Delete Video</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this video?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleDeleteVideo}>Delete video</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteVideoDialog;