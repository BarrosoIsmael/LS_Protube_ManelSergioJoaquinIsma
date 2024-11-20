import React, { useState, useEffect } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Snackbar } from "@mui/material";
import { getEnv } from "../utils/Env";

interface EditCommentDialogProps {
  open: boolean;
  commentId: number;
  onClose: () => void;
  onUpdate: () => void;
}

const EditCommentDialog: React.FC<EditCommentDialogProps> = ({ open, commentId, onClose, onUpdate }) => {
  const [commentText, setCommentText] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const fetchCommentText = async () => {
      try {
        const response = await fetch(getEnv().API_BASE_URL + `/comments/${commentId}/text`);
        if (response.ok) {
          const text = await response.text();
          setCommentText(text);
        }
      } catch (error) {
        console.error("Error fetching comment text:", error);
      }
    };

    if (open) {
      fetchCommentText();
    }
  }, [open, commentId]);

  const handleUpdateComment = async () => {
    const formData = new FormData();
    formData.append("text", commentText);
    try {
      const response = await fetch(getEnv().API_BASE_URL + `/comments/${commentId}/edit`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setSnackbarOpen(true);
        onUpdate();
        onClose();
      }
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Editar Comentario</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Comentario"
            type="text"
            fullWidth
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button onClick={handleUpdateComment}>Actualizar comentario</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message="Comentario editado con éxito"
      />
    </>
  );
};

export default EditCommentDialog;