import { Link } from "react-router-dom";
import { getEnv } from "../utils/Env";

interface VideoCardProps {
  title: string;
  user: string;
  id: string;
}

const VideoCard: React.FC<VideoCardProps> = ({ title, user, id }) => {
  return (
    <Link to={`/video/${id}`} className="video-card">
      <div className="video-card-image">
        <img src={getEnv().API_BASE_URL + `/videos/miniature/${id}`} alt={title} />
      </div>
      <div className="video-card-content">
        <h3>{title}</h3>
        <p>{user}</p>
      </div>
    </Link>
  );
};

export default VideoCard;
