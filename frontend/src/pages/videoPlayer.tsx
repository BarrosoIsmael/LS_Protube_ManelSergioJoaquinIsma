import { useEffect, useState } from "react";
import { useParams} from "react-router-dom";
import { Card, CardContent } from '@mui/material';

const VideoPlayer: React.FC = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const [videoData, setVideoData] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [descriptionVisible, setDescriptionVisible] = useState<boolean>(false);

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
    <div className="flex flex-col min-h-screen bg-black text-white">
      <br />
      <main className="flex-1 container px-4 py-6">
        <div className="w-full max-w-lg mx-auto space-y-4">
          <div className="w-full h-screen">
            <video
              className="w-full h-full"
              controls
              src={videoData.videoUrl}
              poster={videoData.thumbnailUrl}
            />
          </div>

          <h2 className="text-xl font-bold">{videoData.title}</h2>
          <p className="text-gray-400">Category: {videoData.meta.categories.join(", ")}</p>
          <Card sx={{ width: '100%', maxWidth: '52rem', bgcolor: 'grey.900', color: 'white' }}>
            <CardContent sx={{ p: 2 }}>
            <button
              className="text-gray-400 bg-gray-800 p-2 rounded"
              onClick={() => setDescriptionVisible(!descriptionVisible)}
            >
              Description {descriptionVisible ? "▲" : "▼"}
            </button>
            {descriptionVisible && (
              <>
                <br />
                <br />
                <p className="text-gray-400">{videoData.meta.description}</p>
                <br />
                <p className="text-gray-400">
                  {videoData.meta.tags.map((tag: string) => `#${tag}`).join(" ")}
                </p>
              </>
            )}
            </CardContent>
          </Card>
          <br />
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Comments</h3>
            <br />
            {comments.length === 0 ? (
              <p>No comments yet.</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="pb-2">
                  <p className="font-semibold"><i>{comment.author}</i></p>
                  <p>{comment.text}</p>
                  <hr className="border-gray-700" />
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