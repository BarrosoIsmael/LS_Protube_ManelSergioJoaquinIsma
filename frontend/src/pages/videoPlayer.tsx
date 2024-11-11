import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent } from '@mui/material';

const VideoPlayer: React.FC = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const [videoData, setVideoData] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [descriptionVisible, setDescriptionVisible] = useState<boolean>(false);
  const [videoMP4, setVideoMP4] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      if (videoId) {
        try {
          const videoResponse = await fetch(`/api/videos/${videoId}`);
          const commentsResponse = await fetch(`/api/videos/${videoId}/comments`);
          const videoMP4Response = await fetch(`/api/videos/video/${videoId}`);

          if (videoResponse.ok) {
            const videoJson = await videoResponse.json();
            setVideoData(videoJson);
          }

          if (commentsResponse.ok) {
            const commentsJson = await commentsResponse.json();
            setComments(commentsJson);
          }

          if (videoMP4Response.ok) {
            const videoBlob = await videoMP4Response.blob();
            const videoUrl = URL.createObjectURL(videoBlob);
            setVideoMP4(videoUrl);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [videoId]);

  const formatComment = (comment: string) => {
    return comment.replace(/\n/g, '<br />').replace(/\u00a0/g, '&nbsp;');
  };

  if (!videoData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <br />
      <main className="flex-1 container px-4 py-6 mx-auto" style={{ maxWidth: "1200px" }}>
        <div className="space-y-4">
          <div>
            <video
              style={{ width: "100%" }}
              controls
              src={videoMP4}
            />
          </div>

          <h2 className="text-xl font-bold">{videoData.title}</h2>
          <p className="text-gray-400">Category: {videoData.meta.categories.join(", ")}</p>
          <Card sx={{ width: '100%', bgcolor: 'grey.900', color: 'white' }}>
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
                  <p>{videoData.meta.description}</p>
                  <br />
                  <p>
                    {videoData.meta.tags.map((tag: string, index: number) => (
                      <span key={index}>#{tag}{index < videoData.meta.tags.length - 1 ? ', ' : ''}</span>
                    ))}
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <br /> {/* Añadir un salto de línea debajo del Card de la descripción */}

          <div className="comments-section">
            <h3 className="text-lg font-bold">Comments</h3>
            {comments.map((comment, index) => (
              <div key={index} className="comment bg-gray-800 p-2 rounded my-2">
                <p className="text-gray-400 text-sm">{comment.author}</p>
                <p dangerouslySetInnerHTML={{ __html: formatComment(comment.text) }} />
                <hr className="my-2 border-gray-600" /> {/* Línea horizontal divisoria */}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default VideoPlayer;
