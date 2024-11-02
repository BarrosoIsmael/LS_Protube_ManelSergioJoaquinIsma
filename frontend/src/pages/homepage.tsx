import { useEffect, useState } from "react";
import VideoCard from "./../components/VideoCard"; // Asegúrate de que la ruta sea correcta
import { Container, Typography, Box, Grid } from "@mui/material";

const Homepage: React.FC = () => {
  const [videos, setVideos] = useState<any[]>([]); // Estado para almacenar la lista de videos
  const [loading, setLoading] = useState<boolean>(true); // Estado de carga

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch("/api/videos"); // Ajusta la URL según tu backend
        if (response.ok) {
          const data = await response.json();
          setVideos(data);
        } else {
          console.error("Error fetching videos:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Estado de carga
  }

  return (
    <Box sx={{ backgroundColor: '#1c1c1e', minHeight: '100vh', paddingY: 6 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" component="h1" sx={{ color: '#FFFFFF', fontWeight: 'bold', marginBottom: 4 }}>
          Videos
        </Typography>
        <Grid container spacing={4}>
          {videos.map((video) => (
            <Grid item xs={12} sm={6} md={4} key={video.id}>
              <VideoCard
                title={video.title}
                channel={video.channel}
                thumbnail={video.thumbnailUrl}
                videoId={video.id} // Asegúrate de que el id sea el correcto
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Homepage;
