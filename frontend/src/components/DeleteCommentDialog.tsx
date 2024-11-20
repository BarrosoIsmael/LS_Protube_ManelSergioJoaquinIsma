import React from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from "@mui/material";
import { getEnv } from "../utils/Env";

interface DeleteCommentDialogProps {
  open: boolean;
  commentId: number;
  onClose: () => void;
  onDelete: () => void;
}

const DeleteCommentDialog: React.FC<DeleteCommentDialogProps> = ({ open, commentId, onClose, onDelete }) => {

  const handleDeleteComment = async () => {
    try {
      const response = await fetch(getEnv().API_BASE_URL + `/comments/${commentId}/delete`, {
        method: "DELETE",
      });

      if (response.ok) {
        onDelete();
        onClose();
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Eliminar Comentario</DialogTitle>
        <DialogContent>
          <Typography>¿Estás seguro de que deseas eliminar este comentario?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button onClick={handleDeleteComment}>Eliminar comentario</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteCommentDialog;