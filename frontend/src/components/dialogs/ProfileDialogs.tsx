import React from "react";
import { Snackbar } from "@mui/material";
import DeleteUserDialog from "./DeleteUserDialog";
import EditCommentDialog from "./EditCommentDialog";
import DeleteCommentDialog from "./DeleteCommentDialog";
import EditVideoDialog from "./EditVideoDialog";
import DeleteVideoDialog from "./DeleteVideoDialog";

interface ProfileDialogsProps {
  editCommentId: number | null;
  deleteCommentId: number | null;
  editVideoId: number | null;
  deleteVideoId: number | null;
  deleteUserDialogOpen: boolean;
  editSnackbarOpen: boolean;
  deleteSnackbarOpen: boolean;
  editVideoSnackbarOpen: boolean;
  deleteVideoSnackbarOpen: boolean;
  deleteUserSnackbarOpen: boolean;
  handleCloseEditDialog: () => void;
  handleCloseDeleteDialog: () => void;
  handleCloseEditVideoDialog: () => void;
  handleCloseDeleteVideoDialog: () => void;
  handleCloseDeleteUserDialog: () => void;
  handleEditSuccess: () => void;
  handleDeleteSuccess: () => void;
  handleEditVideoSuccess: () => void;
  handleDeleteVideoSuccess: () => void;
  handleDeleteUserSuccess: () => void;
}

const ProfileDialogs: React.FC<ProfileDialogsProps> = ({
  editCommentId,
  deleteCommentId,
  editVideoId,
  deleteVideoId,
  deleteUserDialogOpen,
  editSnackbarOpen,
  deleteSnackbarOpen,
  editVideoSnackbarOpen,
  deleteVideoSnackbarOpen,
  deleteUserSnackbarOpen,
  handleCloseEditDialog,
  handleCloseDeleteDialog,
  handleCloseEditVideoDialog,
  handleCloseDeleteVideoDialog,
  handleCloseDeleteUserDialog,
  handleEditSuccess,
  handleDeleteSuccess,
  handleEditVideoSuccess,
  handleDeleteVideoSuccess,
  handleDeleteUserSuccess,
}) => {
  return (
    <>
      {editCommentId !== null && (
        <EditCommentDialog
          open={editCommentId !== null}
          commentId={editCommentId}
          onClose={handleCloseEditDialog}
          onUpdate={handleEditSuccess}
        />
      )}
      {deleteCommentId !== null && (
        <DeleteCommentDialog
          open={deleteCommentId !== null}
          commentId={deleteCommentId}
          onClose={handleCloseDeleteDialog}
          onDelete={handleDeleteSuccess}
        />
      )}
      {editVideoId !== null && (
        <EditVideoDialog
          open={editVideoId !== null}
          videoId={editVideoId}
          onClose={handleCloseEditVideoDialog}
          onUpdate={handleEditVideoSuccess}
        />
      )}
      {deleteVideoId !== null && (
        <DeleteVideoDialog
          open={deleteVideoId !== null}
          videoId={deleteVideoId}
          onClose={handleCloseDeleteVideoDialog}
          onDelete={handleDeleteVideoSuccess}
        />
      )}
      {deleteUserDialogOpen && (
        <DeleteUserDialog
          open={deleteUserDialogOpen}
          onClose={handleCloseDeleteUserDialog}
          onDelete={handleDeleteUserSuccess}
        />
      )}
      <Snackbar
        open={editSnackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseEditDialog}
        message="Comment edited successfully"
      />
      <Snackbar
        open={deleteSnackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseDeleteDialog}
        message="Comment successfully deleted"
      />
      <Snackbar
        open={editVideoSnackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseEditVideoDialog}
        message="Successfully edited video"
      />
      <Snackbar
        open={deleteVideoSnackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseDeleteVideoDialog}
        message="Video successfully deleted"
      />
      <Snackbar
        open={deleteUserSnackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseDeleteUserDialog}
        message="User successfully deleted"
      />
    </>
  );
};

export default ProfileDialogs;