import React, { useEffect, useState } from "react";
import VideoCard from "../components/VideoCard";
import { Container, Typography, Grid } from "@mui/material";
import "../App.css"; // Importa el archivo CSS

const Homepage: React.FC = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch("/api/videos");
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
    return <div>Loading...</div>;
  }

  return (
    <div className="homepage-background">
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
                videoId={video.id}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
};

export default Homepage;
