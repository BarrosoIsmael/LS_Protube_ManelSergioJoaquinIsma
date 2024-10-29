import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const VideoPlayer: React.FC = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const [videoData, setVideoData] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (videoId) {
        try {
          const videoResponse = await fetch(`/api/videos/${videoId}`);
          const commentsResponse = await fetch(`/api/videos/${videoId}/comments`);

          if (videoResponse.ok) {
            const videoJson = await videoResponse.json();
            setVideoData(videoJson);
          }

          if (commentsResponse.ok) {
            const commentsJson = await commentsResponse.json();
            setComments(commentsJson);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [videoId]);

  if (!videoData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="sticky top-0 z-10 bg-white border-b">
        <div className="container flex items-center justify-between h-14 px-4">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            Pro Tube
          </Link>
        </div>
      </header>

      <main className="flex-1 container px-4 py-6">
        <div className="w-full max-w-lg mx-auto space-y-4">
          <div className="aspect-w-16 aspect-h-9">
            <video
              className="w-full h-full"
              controls
              src={videoData.videoUrl}
              poster={videoData.thumbnailUrl}
            />
          </div>

          <h2 className="text-xl font-bold">{videoData.title}</h2>
          <p className="text-gray-700">{videoData.description}</p>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Comments</h3>
            {comments.length === 0 ? (
              <p>No comments yet.</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="border-b pb-2">
                  <p className="font-semibold">{comment.username}</p>
                  <p>{comment.text}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default VideoPlayer;
