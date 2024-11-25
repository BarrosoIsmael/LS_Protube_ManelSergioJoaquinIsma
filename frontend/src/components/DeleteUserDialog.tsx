import React from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from "@mui/material";
import { getEnv } from "../utils/Env";
import { useAuth } from "../context/AuthContext";
import { useHandleLogout } from "../utils/authUtils";

interface DeleteUserDialogProps {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
}

const DeleteUserDialog: React.FC<DeleteUserDialogProps> = ({ open, onClose, onDelete }) => {
  const { user } = useAuth();
  const handleLogout = useHandleLogout();

  const handleDeleteUser = async () => {
    try {
      const response = await fetch(getEnv().API_BASE_URL + `/users/${user}/delete`, {
        method: "DELETE",
      });

      if (response.ok) {
        onDelete();
        onClose();
        handleLogout();
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete User</DialogTitle>
      <DialogContent>
        <Typography>Are you sure you want to delete this user?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleDeleteUser} color="secondary">Delete User</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteUserDialog;