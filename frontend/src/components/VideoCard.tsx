import { Link } from "react-router-dom";

interface VideoCardProps {
  title: string;
  channel: string;
  thumbnail: string;
  videoId: string;
}

const VideoCard: React.FC<VideoCardProps> = ({ title, channel, thumbnail, videoId }) => {
  return (
    <Link to={`/video/${videoId}`}>
      <div className="flex flex-col cursor-pointer">
        <div className="relative aspect-video mb-2">
          <img src={thumbnail} alt={title} className="rounded-lg object-cover w-full h-full" />
        </div>
        <h3 className="font-semibold text-sm line-clamp-2">{title}</h3>
        <p className="text-xs text-gray-500">{channel}</p>
      </div>
    </Link>
  );
};

export default VideoCard;
