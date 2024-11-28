import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, Avatar, Typography } from '@mui/material';
import { ThumbUp as ThumbUpIcon, ThumbDown as ThumbDownIcon } from '@mui/icons-material';
import { useAuth } from "../context/AuthContext";
import { getEnv } from "../utils/Env";
import { getRandomColor, isColorDark } from '../utils/commentUtils';
import Comment from "../components/Comment";
import './videoPlayer.css';

interface Comment {
  author: string;
  text: string;
  avatarColor?: string;
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
  const [userLikeStatus, setUserLikeStatus] = useState<'like' | 'dislike' | null>(null);
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
            setVideoLikes(videoJson.likes);
            setVideoDislikes(videoJson.dislikes);
          }

          if (commentsResponse.ok) {
            const commentsJson = await commentsResponse.json();
            setComments(commentsJson.map((comment: any) => ({
              author: comment.author,
              text: comment.text,
              avatarColor: comment.avatarColor || getRandomColor()
            })));
          } else {
            setComments([]);
          }

          if (videoMP4Response.ok) {
            const videoBlob = await videoMP4Response.blob();
            setVideoMP4(URL.createObjectURL(videoBlob));
          }
        } catch (error) {
          console.error('Error fetching video data:', error);
        }
      }
    };

    fetchData();
  }, [videoId]);

  const handleLike = async () => {
    if (!user) {
      console.error('User must be logged in to like the video');
      return;
    }

    try {
      let newLikes = videoLikes;
      let newDislikes = videoDislikes;

      if (userLikeStatus === 'like') {
        newLikes -= 1;
        setUserLikeStatus(null);
      } else {
        if (userLikeStatus === 'dislike') {
          newDislikes -= 1;
        }
        newLikes += 1;
        setUserLikeStatus('like');
      }

      const response = await fetch(getEnv().API_BASE_URL + `/videos/${videoId}/like?isLike=true`, {
        method: 'POST',
      });

      if (response.ok) {
        setVideoLikes(newLikes);
        setVideoDislikes(newDislikes);
      }
    } catch (error) {
      console.error('Error liking the video:', error);
    }
  };

  const handleDislike = async () => {
    if (!user) {
      return;
    }

    try {
      let newLikes = videoLikes;
      let newDislikes = videoDislikes;

      if (userLikeStatus === 'dislike') {
        newDislikes -= 1;
        setUserLikeStatus(null);
      } else {
        if (userLikeStatus === 'like') {
          newLikes -= 1;
        }
        newDislikes += 1;
        setUserLikeStatus('dislike');
      }

      const response = await fetch(getEnv().API_BASE_URL + `/videos/${videoId}/like?isLike=false`, {
        method: 'POST',
      });

      if (response.ok) {
        setVideoLikes(newLikes);
        setVideoDislikes(newDislikes);
      }
    } catch (error) {
      console.error('Error disliking the video:', error);
    }
  };

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
            author: user, 
            text: newComment,
            avatarColor: avatarColorRef.current,
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

  const truncateDescription = (text: string) => {
    return text.length > 300 ? text.slice(0, 300) + ' <span class="read-more">... Read more</span>' : text;
  };

  if (!videoData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <main className="flex-1 container px-4 py-6">
        <div className="space-y-4">
          <div>
            <video className="w-full" controls src={videoMP4} />
          </div>

          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">{videoData.title}</h2>
            <div className="flex items-center space-x-4">
              <div onClick={handleLike} className={`inline-flex items-center cursor-pointer mr-16 ${userLikeStatus === 'like' ? 'bg-green' : ''}`}>
                <ThumbUpIcon fontSize="small" sx={{ color: "white" }} />
                <span style={{ color: "white" }}>{videoLikes}</span>
              </div>
              <div onClick={handleDislike} className={`inline-flex items-center cursor-pointer ${userLikeStatus === 'dislike' ? 'bg-red' : ''}`}>
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
              <p dangerouslySetInnerHTML={{ __html: descriptionVisible ? videoData.description : truncateDescription(videoData.description) }} />
              {descriptionVisible && (
                <>
                  <br />
                  <br />
                  {videoData.tags.map((tag: string, index: number) => (
                    <span key={index}>#{tag}{index < videoData.tags.length - 1 ? ', ' : ''}</span>
                  ))}
                </>
              )}
            </CardContent>
          </Card>

          <div className="comments-section mt-4">
            <h3 className="text-lg font-bold">Comments</h3>
            <br />
            <div className="add-comment">
              {user && (
                <Avatar sx={{ bgcolor: avatarColorRef.current, color: isColorDark(avatarColorRef.current) ? 'white' : 'black' }}>
                  {user.charAt(0)}
                </Avatar>
              )}
              <div className="flex-1">
                <input
                  type="text"
                  className="w-full p-2 rounded bg-gray-700"
                  placeholder={user ? "Write a comment..." : "You must be logged in to add a comment."}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  disabled={!user}
                />
              </div>
              {user && (
                <button
                  onClick={handleAddComment}
                  className="bg-gray-700 text-white p-2 rounded"
                >
                  Add Comment
                </button>
              )}
            </div>
            <br />
            {comments.length === 0 ? (
                <Typography 
                  align="center" 
                  variant="h6" 
                  sx={{ paddingTop: "30px", fontSize: "2rem" }}
                >
                  No comments yet
                </Typography>
            ) : (
              <>
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
                  <hr className="hr"/>
                </div>
              ))}
              </>
            )}
            
          </div>
        </div>
      </main>
    </div>
  );
};

export default VideoPlayer;