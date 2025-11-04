"use client";

import type { FC } from 'react';
import { Container, Row } from 'reactstrap';
import { useAppSelector } from '../state/hooks';
import {
  selectCampsiteById,
  selectCampsitesError,
  selectCampsitesLoading,
} from '../features/campsites/campsitesSlice';
import CampsiteDetail from '../features/campsites/CampsiteDetail';
import CommentsList from '../features/comments/CommentsList';
import SubHeader from '../components/SubHeader';
import Error from '../components/Error';
import Loading from '../components/Loading';

interface CampsiteDetailPageProps {
  campsiteId?: number;
}

const CampsiteDetailPage: FC<CampsiteDetailPageProps> = ({ campsiteId }) => {
  const campsite = useAppSelector(selectCampsiteById(campsiteId));
  const isLoading = useAppSelector(selectCampsitesLoading);
  const errMsg = useAppSelector(selectCampsitesError);

  let content: JSX.Element | null = null;

  if (isLoading) {
    content = <Loading />;
  } else if (errMsg) {
    content = <Error errMsg={errMsg} />;
  } else if (campsite && typeof campsiteId === 'number') {
    content = (
      <>
        <CampsiteDetail campsite={campsite} />
        <CommentsList campsiteId={campsiteId} />
      </>
    );
  } else {
    content = <Error errMsg="Campsite not found." />;
  }

  return (
    <Container>
      {campsite && <SubHeader current={campsite.name} detail />}
      <Row>{content}</Row>
    </Container>
  );
};

export default CampsiteDetailPage;
