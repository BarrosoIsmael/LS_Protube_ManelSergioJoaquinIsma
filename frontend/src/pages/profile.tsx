import React, { useEffect, useState } from "react";
import { Container, Box, Typography, Grid, Paper, IconButton, Snackbar, Button } from "@mui/material";
import { getEnv } from "../utils/Env";
import { useAuth } from "../context/AuthContext";
import VideoCard from "../components/VideoCard";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Comment from "../components/Comment";
import EditCommentDialog from "../components/EditCommentDialog";
import DeleteCommentDialog from "../components/DeleteCommentDialog";
import EditVideoDialog from "../components/EditVideoDialog";
import DeleteVideoDialog from "../components/DeleteVideoDialog";
import DeleteUserDialog from "../components/DeleteUserDialog";
import "./profile.css";

const Profile: React.FC = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [editCommentId, setEditCommentId] = useState<number | null>(null);
  const [deleteCommentId, setDeleteCommentId] = useState<number | null>(null);
  const [editVideoId, setEditVideoId] = useState<number | null>(null);
  const [deleteVideoId, setDeleteVideoId] = useState<number | null>(null);
  const [editSnackbarOpen, setEditSnackbarOpen] = useState(false);
  const [deleteSnackbarOpen, setDeleteSnackbarOpen] = useState(false);
  const [editVideoSnackbarOpen, setEditVideoSnackbarOpen] = useState(false);
  const [deleteVideoSnackbarOpen, setDeleteVideoSnackbarOpen] = useState(false);
  const [deleteUserDialogOpen, setDeleteUserDialogOpen] = useState(false);
  const [deleteUserSnackbarOpen, setDeleteUserSnackbarOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchVideosAndComments = async () => {
      try {
        const videoInfoResponse = await fetch(getEnv().API_BASE_URL + `/users/${user}/videos`);
        const commentsResponse = await fetch(getEnv().API_BASE_URL + `/users/${user}/comments`);

        if (videoInfoResponse.ok) {
          const videosInfo = await videoInfoResponse.json();
          setVideos(videosInfo);
        } else {
          setVideos([]);
        }

        if (commentsResponse.ok) {
          const commentsJson = await commentsResponse.json();
          setComments(commentsJson);
        } else {
          setComments([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchVideosAndComments();
  }, [user]);

  const handleEditComment = (index: number) => {
    setEditCommentId(comments[index].id);
  };

  const handleDeleteComment = (index: number) => {
    setDeleteCommentId(comments[index].id);
  };

  const handleEditVideo = (index: number) => {
    setEditVideoId(videos[index].id);
  };

  const handleDeleteVideo = (index: number) => {
    setDeleteVideoId(videos[index].id);
  };

  const handleCloseEditDialog = () => {
    setEditCommentId(null);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteCommentId(null);
  };

  const handleCloseEditVideoDialog = () => {
    setEditVideoId(null);
  };

  const handleCloseDeleteVideoDialog = () => {
    setDeleteVideoId(null);
  };

  const handleUpdateComments = async () => {
    const commentsResponse = await fetch(getEnv().API_BASE_URL + `/users/${user}/comments`);
    if (commentsResponse.ok) {
      const commentsJson = await commentsResponse.json();
      setComments(commentsJson);
    }
  };

  const handleUpdateVideos = async () => {
    const videoInfoResponse = await fetch(getEnv().API_BASE_URL + `/users/${user}/videos`);
    if (videoInfoResponse.ok) {
      const videosInfo = await videoInfoResponse.json();
      setVideos(videosInfo);
    }
  };

  const handleEditSuccess = () => {
    setEditSnackbarOpen(true);
    handleUpdateComments();
  };

  const handleDeleteSuccess = () => {
    setDeleteSnackbarOpen(true);
    handleUpdateComments();
  };

  const handleEditVideoSuccess = () => {
    setEditVideoSnackbarOpen(true);
    handleUpdateVideos();
  };

  const handleDeleteVideoSuccess = () => {
    setDeleteVideoSnackbarOpen(true);
    handleUpdateVideos();
  };

  const handleDeleteUserSuccess = () => {
    setDeleteUserSnackbarOpen(true);
  };

  return (
    <Container maxWidth="lg" className="profile-container">
      <Box className="profile-box">
        <Typography variant="h4" component="h1" className="profile-title">
          My Profile
        </Typography>

        <Paper className="user-info-paper">
          <Typography variant="h6" gutterBottom>
            User information
          </Typography>
          <Typography variant="body1">Username: {user}</Typography>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setDeleteUserDialogOpen(true)}
            style={{ marginLeft: 'auto' }}
          >
            Delete User
          </Button>
        </Paper>

        <Box className="section">
          <Typography variant="h5" gutterBottom>
            Uploaded Videos
          </Typography>
          {videos.length === 0 ? (
            <Typography className="no-content-message" variant="h6">
              No videos yet
            </Typography>
          ) : (
            <Grid container spacing={4}>
              {videos.map((video, index) => (
                <Grid item xs={12} sm={6} md={3} key={video.id}>
                <VideoCard title={video.title} user={""} id={video.id.toString()} />
                <Box className="video-icon-buttons">
                  <IconButton onClick={() => handleEditVideo(index)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteVideo(index)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Grid>
              ))}
            </Grid>
          )}
        </Box>

        <Box className="section">
          <Typography variant="h5" gutterBottom>
            My Comments
          </Typography>
          {comments.length === 0 ? (
            <Typography className="no-content-message" variant="h6">
              No comments yet
            </Typography>
          ) : (
            <Grid container spacing={2} direction="column">
              {comments.map((comment, index) => (
                <Box key={index} className="comment-item" display="flex" alignItems="center">
                  <Box flexGrow={1}>
                    <Comment
                      comment={comment}
                      index={index}
                      comments={comments}
                      setComments={setComments}
                    />
                  </Box>
                  <Box display="flex" flexDirection="column">
                    <IconButton onClick={() => handleEditComment(index)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteComment(index)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              ))}
            </Grid>
          )}
        </Box>
      </Box>
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
          onClose={() => setDeleteUserDialogOpen(false)}
          onDelete={handleDeleteUserSuccess}
        />
      )}
      <Snackbar
        open={editSnackbarOpen}
        autoHideDuration={6000}
        onClose={() => setEditSnackbarOpen(false)}
        message="Comment edited successfully"
      />
      <Snackbar
        open={deleteSnackbarOpen}
        autoHideDuration={6000}
        onClose={() => setDeleteSnackbarOpen(false)}
        message="Comment successfully deleted"
      />
      <Snackbar
        open={editVideoSnackbarOpen}
        autoHideDuration={6000}
        onClose={() => setEditVideoSnackbarOpen(false)}
        message="Successfully edited video"
      />
      <Snackbar
        open={deleteVideoSnackbarOpen}
        autoHideDuration={6000}
        onClose={() => setDeleteVideoSnackbarOpen(false)}
        message="Video successfully deleted"
      />
      <Snackbar
        open={deleteUserSnackbarOpen}
        autoHideDuration={6000}
        onClose={() => setDeleteUserSnackbarOpen(false)}
        message="User successfully deleted"
      />
    </Container>
  );
};

export default Profile;