import React from 'react';
import { formatComment} from '../utils/commentUtils';

interface CommentProps {
  comment: any;
  index: number;
  comments: any[];
  setComments: React.Dispatch<React.SetStateAction<any[]>>;
}

const Comment: React.FC<CommentProps> = ({
  comment,
  index
}) => {
  return (
    <div key={index} className="comment-container" style={{ marginBottom: '16px' }}>
      <div className="flex items-start space-x-4">
        <div className="comment-content flex-1">
          <h6 dangerouslySetInnerHTML={{ __html: formatComment(comment.text) }} />
        </div>
      </div>
    </div>
  );
};

export default Comment;