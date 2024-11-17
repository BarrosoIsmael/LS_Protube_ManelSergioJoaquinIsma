import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent } from '@mui/material';
import { getEnv } from "../utils/Env";
import Avatar from '@mui/material/Avatar';
import { useAuth } from "../context/AuthContext";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

interface Comment {
  author: string;
  text: string;
  avatarColor?: string;
  likes: number;
  dislikes: number;
}

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
  const [comments, setComments] = useState<Comment[]>([]);
  const [descriptionVisible, setDescriptionVisible] = useState<boolean>(false);
  const [videoMP4, setVideoMP4] = useState<string>("");
  const [newComment, setNewComment] = useState<string>("");
  const [videoLikes, setVideoLikes] = useState<number>(0);
  const [videoDislikes, setVideoDislikes] = useState<number>(0);

  const { user } = useAuth();
  const [userAvatarColor] = useState<string>(getRandomColor());

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
            const commentsJson: Comment[] = await commentsResponse.json();
            setComments(
              commentsJson.map((comment) => ({
                ...comment,
                avatarColor: getRandomColor(),
                likes: 0,
                dislikes: 0,
              }))
            );
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

  const handleAddComment = () => {
    if (newComment.trim() !== "") {
      const newCommentData: Comment = {
        author: user || "Anonymous",
        text: newComment,
        avatarColor: userAvatarColor,
        likes: 0,
        dislikes: 0,
      };
      setComments([newCommentData, ...comments]);
      setNewComment("");
    }
  };

  const handleVideoLike = () => setVideoLikes(videoLikes + 1);
  const handleVideoDislike = () => setVideoDislikes(videoDislikes + 1);

  const handleCommentLike = (index: number) => {
    const updatedComments = [...comments];
    updatedComments[index].likes += 1;
    setComments(updatedComments);
  };

  const handleCommentDislike = (index: number) => {
    const updatedComments = [...comments];
    updatedComments[index].dislikes += 1;
    setComments(updatedComments);
  };

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

          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">{videoData.title}</h2>
            <div className="flex items-center space-x-4" style={{ display: "inline-flex" }}>
              <div
                onClick={handleVideoLike}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  cursor: "pointer",
                }}
              >
                <ThumbUpIcon fontSize="small" sx={{ color: "white" }} />
                <span style={{ color: "white" }}>{videoLikes}</span>
              </div>
              <div
                onClick={handleVideoDislike}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  marginLeft: "10px",
                  cursor: "pointer",
                }}
              >
                <ThumbDownIcon fontSize="small" sx={{ color: "white" }} />
                <span style={{ color: "white" }}>{videoDislikes}</span>
              </div>
            </div>
          </div>

          <p className="text-gray-400">Category: {videoData.meta.categories.join(", ")}</p>

          <Card 
            sx={{ bgcolor: 'grey.900', color: 'white', padding: '16px', marginTop: '10px', cursor: 'pointer' }}
            onClick={() => setDescriptionVisible(!descriptionVisible)}
          >
            <CardContent sx={{ paddingTop: '8px' }}>
              <p>
                {descriptionVisible
                  ? <>
                      {videoData.meta.description}
                      <br /><br />
                      {videoData.meta.tags.map((tag: string, index: number) => (
                        <span key={index}>#{tag}{index < videoData.meta.tags.length - 1 ? ', ' : ''}</span>
                      ))}
                    </>
                  : truncateDescription(videoData.meta.description)}
              </p>
            </CardContent>
          </Card>

          <div className="comments-section mt-4">
            <h3 className="text-lg font-bold">{comments.length} Comments</h3>
            <br />
            {user ? (
              <div className="add-comment flex items-start space-x-4">
                <Avatar sx={{ bgcolor: userAvatarColor, color: 'white' }}>{user.charAt(0)}</Avatar>
                <div className="flex-1">
                  <p>Add a comment</p>
                  <input
                    type="text"
                    className="w-full p-2 rounded"
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    style={{ backgroundColor: "#424242", color: "white" }}
                  />
                  <button
                    className="mt-2 px-4 py-2 rounded"
                    onClick={handleAddComment}
                    style={{ backgroundColor: "#424242", color: "white" }}
                  >
                    Comment
                  </button>
                </div>
              </div>
            ) : (
              <div className="add-comment flex items-start space-x-4">
                <Avatar sx={{ bgcolor: 'black', color: 'white' }} />
                <div className="flex-1">
                  <p>Sign in to add a comment</p>
                </div>
              </div>
            )}
            <br />
            {comments.map((comment, index) => {
              const textColor = isColorDark(comment.avatarColor || '#000') ? 'white' : 'black';
              return (
                <div key={index}>
                  <div className="comment flex items-start space-x-4">
                    <Avatar sx={{ bgcolor: comment.avatarColor, color: textColor }}>{comment.author.charAt(0)}</Avatar>
                    <div>
                      <p className="italic">@{comment.author}</p>
                      <h6 className="font-bold text-lg" dangerouslySetInnerHTML={{ __html: formatComment(comment.text) }} />
                      <div className="flex space-x-4" style={{ display: "flex", alignItems: "center" }}>
                        <div
                          onClick={() => handleCommentLike(index)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            cursor: "pointer",
                          }}
                        >
                          <ThumbUpIcon fontSize="small" sx={{ color: "gray" }} />
                          <span style={{ color: "gray" }}>{comment.likes}</span>
                        </div>
                        <div
                          onClick={() => handleCommentDislike(index)}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            marginLeft:"10px",
                            cursor: "pointer",
                          }}
                        >
                          <ThumbDownIcon fontSize="small" sx={{ color: "gray" }} />
                          <span style={{ color: "gray" }}>{comment.dislikes}</span>
                        </div>
                      </div>
                    </div>
                  </div>
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
