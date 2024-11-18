import React, { useEffect, useState } from "react";
import { Container, Box, Typography, Grid, Paper, IconButton } from "@mui/material";
import { getEnv } from "../utils/Env";
import { useAuth } from "../context/AuthContext";
import VideoCard from "../components/VideoCard";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Comment from "../components/Comment";

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
          console.log("Comments:", commentsJson);
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
    // Lógica para editar el comentario
    console.log(`Edit comment at index ${index}`);
  };

  const handleDeleteComment = (index: number) => {
    // Lógica para borrar el comentario
    console.log(`Delete comment at index ${index}`);
  };


  return (
    <Container maxWidth="lg" sx={{ marginTop: "20px" }}>
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Mi Perfil
        </Typography>
        <Paper sx={{ bgcolor: 'grey.900', color: 'white', width: "100%", padding: "20px", marginBottom: "20px" }}>
          <Typography variant="h6" gutterBottom>
            Información del usuario
          </Typography>
          <Typography variant="body1">
            Nombre de usuario: {user}
          </Typography>
        </Paper>
        <Box sx={{ width: "100%", marginBottom: "20px" }}>
          <Typography variant="h5" gutterBottom>
            Videos Subidos
          </Typography>
          {videos.length === 0 ? (
            <div>No hay videos</div>
          ) : (
            <Container maxWidth="lg">
              <Box sx={{ backgroundColor: 'black', marginTop: 4 }}>
                <Grid container spacing={4}>
                  {videos.map((video) => (
                    <Grid item xs={12} sm={6} md={3} key={video.id}>
                      <VideoCard
                        title={video.title}
                        user={""}
                        id={video.id.toString()}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Container>
          )}
        </Box>
        <Box sx={{ width: "100%", marginBottom: "20px", marginTop: "20px"}}>
          <Typography variant="h5" gutterBottom>
            Mis Comentarios
          </Typography>
          {comments.length === 0 ? (
            <div style={{ marginBottom: "20px" }}>No hay comentarios</div>
          ) : (
            <Grid container spacing={2} direction="column" marginBottom={'16px'}>
              {comments.map((comment, index) => (
                <div key={index} className="comment-container" style={{ marginTop: "30px", marginLeft: '30px' }}>
                  <div className="flex items-start space-x-4">
                    <Comment
                      key={index}
                      comment={comment}
                      index={index}
                      comments={comments}
                      setComments={setComments}
                    />
                    <IconButton onClick={() => handleEditComment(index)}>
                      <EditIcon fontSize="small" sx={{ color: 'white' }} />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteComment(index)}>
                      <DeleteIcon fontSize="small" sx={{ color: 'white' }} />
                    </IconButton>
                  </div>
                  <hr/>
                </div>
              ))}
            </Grid>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default Profile;