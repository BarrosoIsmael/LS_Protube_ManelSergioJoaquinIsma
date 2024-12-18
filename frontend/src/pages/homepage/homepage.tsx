import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import VideoCard from "../../components/video-card/VideoCard";
import { Box, Container, Grid, Typography } from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import { getEnv } from "../../utils/Env";
import "./homepage.css";

const Homepage: React.FC = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const location = useLocation();

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

    if (location.state && location.state.searchResults) {
      setVideos(location.state.searchResults);
      setLoading(false);
    } else {
      fetchVideos();
    }
  }, [location.state]);

  if (loading) {
    return (
      <div className="loading-container">
        <CircularProgress />
      </div>
    );
  }

  return (
      <Container maxWidth="lg">
        <Box className="homepage-content">
          {videos.length === 0 ? (
            <Typography className="no-content-message" variant="h6">
              No videos found
            </Typography>
          ) : (
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
          )}
        </Box>
      </Container>
  );
};

export default Homepage;
