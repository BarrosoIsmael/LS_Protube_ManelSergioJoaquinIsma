import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent } from '@mui/material';
import { getEnv } from "../utils/Env";
import Avatar from '@mui/material/Avatar';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { useAuth } from "../context/AuthContext";
import {getRandomColor, isColorDark } from '../utils/commentUtils';
import Comment from "../components/Comment";

interface Comment {
  author: string;
  text: string;
  avatarColor?: string;
  likes: number;
  dislikes: number;
}

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
  const avatarColorRef = useRef<string>(getRandomColor());

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
            setComments(commentsJson.map((comment: any) => ({
              ...comment,
              avatarColor: getRandomColor(),
              likes: 0,
              dislikes: 0,
            })));
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

  const handleAddComment = async () => {
    if (!user) {
      return;
    }

    if (newComment.trim() !== "") {
      try {
        const response = await fetch(getEnv().API_BASE_URL + `/videos/${videoId}/addComment`, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({ text: newComment, username: user }),
        });

        if (response.ok) {
          const newCommentData: Comment = {
            author: user, // Usa el nombre de usuario del contexto de autenticación
            text: newComment,
            avatarColor: avatarColorRef.current,
            likes: 0,
            dislikes: 0,
          };
          setComments([newCommentData, ...comments]);
          setNewComment("");
        } else {
          console.error("Failed to add comment");
        }
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    }
  };

  const handleVideoLike = () => setVideoLikes(videoLikes + 1);
  const handleVideoDislike = () => setVideoDislikes(videoDislikes + 1);

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
            <video style={{ width: "100%" }} controls src={videoMP4} />
          </div>

          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">{videoData.title}</h2>
            <div className="flex items-center space-x-4">
              <div onClick={handleVideoLike} style={{ display: "inline-flex", alignItems: "center", cursor: "pointer", marginRight: "16px"}}>
                <ThumbUpIcon fontSize="small" sx={{ color: "white" }} />
                <span style={{ color: "white" }}>{videoLikes}</span>
              </div>
              <div onClick={handleVideoDislike} style={{ display: "inline-flex", alignItems: "center", cursor: "pointer" }}>
                <ThumbDownIcon fontSize="small" sx={{ color: "white" }} />
                <span style={{ color: "white" }}>{videoDislikes}</span>
              </div>
            </div>
          </div>

          <Card
            sx={{ bgcolor: 'grey.900', color: 'white', padding: '16px', marginTop: '10px', cursor: 'pointer' }}
            onClick={() => setDescriptionVisible(!descriptionVisible)}
          >
            <CardContent>
              <p>
                {descriptionVisible
                  ? <>
                      {videoData.description}
                      <br />
                      <br />
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
            <div className="add-comment flex items-start space-x-4">
              <Avatar sx={{ bgcolor: user ? avatarColorRef.current : 'grey.700', color: user ? (isColorDark(avatarColorRef.current) ? 'white' : 'black') : 'white' }}>
                {user ? user.charAt(0) : null}
              </Avatar>
              <div className="flex-1">
                <input
                  type="text"
                  className="w-full p-2 rounded"
                  placeholder={user ? "Write a comment..." : "You must be logged in to add a comment."}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  style={{ backgroundColor: "#424242", color: "white", minWidth: "350px" }}
                  disabled={!user}
                />
                {user && (
                  <button
                    onClick={handleAddComment}
                    style={{ marginTop: "10px", backgroundColor: "#424242", color: "white", padding: "8px", borderRadius: "4px" }}
                  >
                    Add Comment
                  </button>
                )}
              </div>
            </div>
            <br />
            {comments.map((comment, index) => (
              <div key={index} className="comment-container">
                <div className="flex items-start space-x-4">
                  <Avatar
                    sx={{
                      bgcolor: comment.avatarColor,
                      color: isColorDark(comment.avatarColor ?? '') ? 'white' : 'black',
                      marginBottom: "5px"
                    }}
                  >
                    {comment.author.charAt(0)}
                  </Avatar>
                  <p className="italic">@{comment.author}</p>
                  <Comment
                    key={index}
                    comment={comment}
                    index={index}
                    comments={comments}
                    setComments={setComments}
                  />
                </div>
                <hr/>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default VideoPlayer;
