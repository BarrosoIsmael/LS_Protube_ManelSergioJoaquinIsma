import React from "react";
import { useNavigate } from "react-router-dom";
import { getEnv } from "../utils/Env";

interface VideoCardProps {
  title: string;
  user: string;
  id: string;
}

const VideoCard: React.FC<VideoCardProps> = ({ title, user, id }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/video/${id}`);
  };

  return (
    <div onClick={handleClick} className="video-card">
      <div className="video-card-image">
        <img src={getEnv().API_BASE_URL + `/videos/miniature/${id}`} alt={title} />
      </div>
      <div className="video-card-content">
        <h3>{title}</h3>
        <p>{user}</p>
      </div>
    </div>
  );
};

export default VideoCard;