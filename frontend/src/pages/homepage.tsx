import React, { useEffect, useState } from "react";
import VideoCard from "../components/VideoCard";
import { Box, Container, Grid } from "@mui/material";
import "../App.css";
import { getEnv } from "../utils/Env";

const Homepage: React.FC = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const videoInfoResponse = await fetch(getEnv().API_BASE_URL + "/videos/allVideosInfo");
        
        if (videoInfoResponse.ok) {
          const videosInfo = await videoInfoResponse.json();
          setVideos(videosInfo);
        } else {
          console.error("Error fetching all videos info");
        }
      } catch (error) {
        console.error("Error fetching video data:", error);
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
        <Box sx={{ backgroundColor: 'black', marginTop: 4 }}>
          <Grid container spacing={4}>
            {videos.map((video) => (
              <Grid item xs={12} sm={6} md={3} key={video.id}>
                <VideoCard
                  title={video.title}
                  user={video.user}
                  id={video.id.toString()}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </div>
  );
};

export default Homepage;
