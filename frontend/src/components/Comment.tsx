import React from 'react';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { handleCommentLikeWrapper, handleCommentDislikeWrapper, formatComment} from '../utils/commentUtils';

interface CommentProps {
  comment: any;
  index: number;
  comments: any[];
  setComments: React.Dispatch<React.SetStateAction<any[]>>;
}

const Comment: React.FC<CommentProps> = ({
  comment,
  index,
  comments,
  setComments
}) => {
  return (
    <div key={index} className="comment-container" style={{ marginBottom: '16px' }}>
      <div className="flex items-start space-x-4">
        <div className="comment-content flex-1">
          <h6 dangerouslySetInnerHTML={{ __html: formatComment(comment.text) }} />
          <div className="flex items-center space-x-4 mt-2" style={{ display: 'flex', justifyContent: 'start', gap: '10px' }}>
            <div onClick={() => handleCommentLikeWrapper(comments, index, setComments)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <ThumbUpIcon fontSize="small" sx={{ color: 'gray' }} />
              <span style={{ color: 'gray', marginLeft: '4px' }}>{comment.likes}</span>
            </div>
            <div onClick={() => handleCommentDislikeWrapper(comments, index, setComments)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <ThumbDownIcon fontSize="small" sx={{ color: 'gray' }} />
              <span style={{ color: 'gray', marginLeft: '4px' }}>{comment.dislikes}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comment;