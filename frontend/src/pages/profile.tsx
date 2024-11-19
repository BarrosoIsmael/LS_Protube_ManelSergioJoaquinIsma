import React, { useEffect, useState } from "react";
import { Container, Box, Typography, Grid, Paper, IconButton } from "@mui/material";
import { getEnv } from "../utils/Env";
import { useAuth } from "../context/AuthContext";
import VideoCard from "../components/VideoCard";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Comment from "../components/Comment";
import "./profile.css";

const Profile: React.FC = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
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
    console.log(`Edit comment at index ${index}`);
  };

  const handleDeleteComment = (index: number) => {
    console.log(`Delete comment at index ${index}`);
  };

  return (
    <Container maxWidth="lg" className="profile-container">
      <Box className="profile-box">
        <Typography variant="h4" component="h1" className="profile-title">
          Mi Perfil
        </Typography>

        <Paper className="user-info-paper">
          <Typography variant="h6" gutterBottom>
            Información del usuario
          </Typography>
          <Typography variant="body1">Nombre de usuario: {user}</Typography>
        </Paper>

        <Box className="section">
          <Typography variant="h5" gutterBottom>
            Videos Subidos
          </Typography>
          {videos.length === 0 ? (
            <Typography>No hay videos</Typography>
          ) : (
            <Grid container spacing={4}>
              {videos.map((video) => (
                <Grid item xs={12} sm={6} md={3} key={video.id}>
                  <VideoCard title={video.title} user={""} id={video.id.toString()} />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>

        <Box className="section">
          <Typography variant="h5" gutterBottom>
            Mis Comentarios
          </Typography>
          {comments.length === 0 ? (
            <Typography>No hay comentarios</Typography>
          ) : (
            <Grid container spacing={2} direction="column">
              {comments.map((comment, index) => (
                <Box key={index} className="comment-item">
                  <Comment
                    comment={comment}
                    index={index}
                    comments={comments}
                    setComments={setComments}
                  />
                  <IconButton onClick={() => handleEditComment(index)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteComment(index)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Grid>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default Profile;
