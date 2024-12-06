import React, { useEffect, useState } from "react";
import { Container, Box, Typography, Grid, Paper, IconButton, Button } from "@mui/material";
import { getEnv } from "../../utils/Env";
import { useAuth } from "../../context/AuthContext";
import VideoCard from "../../components/video-card/VideoCard";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Comment from "../../components/Comment";
import ProfileDialogs from "../../components/dialogs/ProfileDialogs";
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

  const handleCloseDeleteUserDialog = () => {
    setDeleteUserDialogOpen(false);
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

        <Paper className="user-info-paper" sx={{ bgcolor: 'grey.900', color: 'white' }}>
          <Box display="flex" alignItems="center">
            <AccountCircleIcon className="user-icon" sx={{ fontSize: '6rem' }}/>  
            <Box>
              <Typography variant="h6" gutterBottom className="user-info-title">
                User information
              </Typography>
              <Typography variant="body1" className="username">Username: {user}</Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setDeleteUserDialogOpen(true)}
            className="delete-user-button"
            startIcon={<DeleteIcon />} 
            sx={{ backgroundColor: 'red' }}
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
              <hr className="hr"/>
              No videos yet ​😞​
              <hr className="hr"/>
            </Typography>
            
          ) : (
            <Grid container spacing={4}>
              {videos.map((video, index) => (
                <Grid item xs={12} sm={6} md={3} key={video.id}>
                  <VideoCard title={video.title} user={""} id={video.id.toString()} />
                  <Box className="video-icon-buttons">
                    <IconButton className="edit-icon" onClick={() => handleEditVideo(index)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton className="delete-icon" onClick={() => handleDeleteVideo(index)}>
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
              <hr className="hr"/>
              No comments yet 😞
              <hr className="hr"/>
            </Typography>
          ) : (
            <Grid container spacing={2} direction="column" className="comment-grid">
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
                    <IconButton className="edit-icon" onClick={() => handleEditComment(index)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton className="delete-icon" onClick={() => handleDeleteComment(index)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              ))}
            </Grid>
          )}
        </Box>
      </Box>
      <ProfileDialogs
        editCommentId={editCommentId}
        deleteCommentId={deleteCommentId}
        editVideoId={editVideoId}
        deleteVideoId={deleteVideoId}
        deleteUserDialogOpen={deleteUserDialogOpen}
        editSnackbarOpen={editSnackbarOpen}
        deleteSnackbarOpen={deleteSnackbarOpen}
        editVideoSnackbarOpen={editVideoSnackbarOpen}
        deleteVideoSnackbarOpen={deleteVideoSnackbarOpen}
        deleteUserSnackbarOpen={deleteUserSnackbarOpen}
        handleCloseEditDialog={handleCloseEditDialog}
        handleCloseDeleteDialog={handleCloseDeleteDialog}
        handleCloseEditVideoDialog={handleCloseEditVideoDialog}
        handleCloseDeleteVideoDialog={handleCloseDeleteVideoDialog}
        handleCloseDeleteUserDialog={handleCloseDeleteUserDialog}
        handleEditSuccess={handleEditSuccess}
        handleDeleteSuccess={handleDeleteSuccess}
        handleEditVideoSuccess={handleEditVideoSuccess}
        handleDeleteVideoSuccess={handleDeleteVideoSuccess}
        handleDeleteUserSuccess={handleDeleteUserSuccess}
      />
    </Container>
  );
};

export default Profile;