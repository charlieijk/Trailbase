import type { FC } from 'react';
import type { LegacyComment } from '../../types/legacy.types';
import { formatDate } from '../../utils/formatDate';

interface CommentProps {
  comment: LegacyComment;
}

const Comment: FC<CommentProps> = ({ comment }) => {
  const { text: commentText, rating, author, date } = comment;

  return (
    <p>
      {commentText}
      <br />
      {rating}/5 stars -- {author}, {formatDate(date)}
    </p>
  );
};

export default Comment;
