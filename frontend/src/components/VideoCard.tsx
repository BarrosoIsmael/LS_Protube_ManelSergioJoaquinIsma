import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEnv } from "../utils/Env";

interface VideoCardProps {
  title: string;
  user: string;
  id: string;
}

const VideoCard: React.FC<VideoCardProps> = ({ title, user, id }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    navigate(`/video/${id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="video-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="video-card-image">
        {isHovered ? (
          <video
            src={getEnv().API_BASE_URL + `/videos/video/${id}`}
            autoPlay
            muted
            loop
            className="video-card-video"
            width="250" 
            height="140" 
          />
        ) : (
          <img
            src={getEnv().API_BASE_URL + `/videos/miniature/${id}`}
            alt={title}
          />
        )}
      </div>
      <div className="video-card-content">
        <h3>{title}</h3>
        <p>{user}</p>
      </div>
    </div>
  );
};

export default VideoCard;