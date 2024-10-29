import { useEffect, useState } from "react";
import VideoCard from "./../components/VideoCard"; // Asegúrate de que la ruta sea correcta

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
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Videos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.map((video) => (
          <VideoCard
            key={video.id}
            title={video.title}
            channel={video.channel}
            thumbnail={video.thumbnailUrl}
            videoId={video.id} // Asegúrate de que el id sea el correcto
          />
        ))}
      </div>
    </div>
  );
};

export default Homepage;
