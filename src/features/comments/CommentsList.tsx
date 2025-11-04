import type { FC } from 'react';
import { Col, Row } from 'reactstrap';
import { useAppSelector } from '../../app/hooks';
import Comment from './Comment';
import {
  selectCommentsByCampsiteId,
  selectCommentsError,
  selectCommentsLoading,
} from './commentsSlice';
import CommentForm from './CommentForm';
import Error from '../../components/Error';
import Loading from '../../components/Loading';

interface CommentsListProps {
  campsiteId: number;
}

const CommentsList: FC<CommentsListProps> = ({ campsiteId }) => {
  const comments = useAppSelector(selectCommentsByCampsiteId(campsiteId));
  const isLoading = useAppSelector(selectCommentsLoading);
  const errMsg = useAppSelector(selectCommentsError);

  if (isLoading) {
    return (
      <Row>
        <Loading />
      </Row>
    );
  }

  if (errMsg) {
    return (
      <Row>
        <Error errMsg={errMsg} />
      </Row>
    );
  }

  if (comments.length > 0) {
    return (
      <Col md="5" className="m-1">
        <h4>Comments</h4>
        {comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
        <CommentForm campsiteId={campsiteId} />
      </Col>
    );
  }

  return (
    <Col md="5" className="m-1">
      There are no comments for this campsite yet.
      <CommentForm campsiteId={campsiteId} />
    </Col>
  );
};

export default CommentsList;
