import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent } from '@mui/material';

import { getEnv } from "../utils/Env";
import Avatar from '@mui/material/Avatar';

// Función para generar un color aleatorio
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

// Función para determinar si un color es claro u oscuro
const isColorDark = (color: string) => {
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 128;
};

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
          const videoResponse = await fetch(getEnv().API_BASE_URL + `/videos/${videoId}`);
          const commentsResponse = await fetch(getEnv().API_BASE_URL + `/videos/${videoId}/comments`);
          const videoMP4Response = await fetch(getEnv().API_BASE_URL + `/videos/video/${videoId}`);

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

  // Función para truncar la descripción a 3 líneas aproximadas
  const truncateDescription = (text: string) => {
    return text.length > 300 ? text.slice(0, 300) + '...' : text;
  };

  if (!videoData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
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
          <p className="text-gray-400">Category: {videoData.category}</p>

          <Card 
            sx={{ bgcolor: 'grey.900', color: 'white', padding: '16px', marginTop: '10px', cursor: 'pointer' }}
            onClick={() => setDescriptionVisible(!descriptionVisible)}
          >
            <CardContent sx={{ paddingTop: '8px' }}>
              <p>
                {descriptionVisible
                  ? <>
                      {videoData.description}
                      <br /><br />
                      {videoData.tags.map((tag: string, index: number) => (
                        <span key={index}>#{tag}{index < videoData.tags.length - 1 ? ', ' : ''}</span>
                      ))}
                    </>
                  : truncateDescription(videoData.description)}
              </p>
            </CardContent>
          </Card>

          <div className="comments-section mt-4">
            <h3 className="text-lg font-bold">Comments</h3>
            <br />
            {comments.map((comment, index) => {
              const avatarColor = getRandomColor();
              const textColor = isColorDark(avatarColor) ? 'white' : 'black';
              return (
                <div key={index}>
                  <div className="comment flex items-start space-x-4">
                    <Avatar sx={{ bgcolor: avatarColor, color: textColor }}>{comment.author.charAt(0)}</Avatar>
                    <div>
                      <p className="italic">@{comment.author}</p>
                      <h6 className="font-bold text-lg" dangerouslySetInnerHTML={{ __html: formatComment(comment.text) }}></h6>
                    </div>
                  </div>
                  {index < comments.length - 1 && <hr className="my-4 border-gray-700" />}
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default VideoPlayer;