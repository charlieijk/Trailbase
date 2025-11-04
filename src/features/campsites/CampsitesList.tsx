import type { FC } from 'react';
import { Col, Row } from 'reactstrap';
import { useAppSelector } from '../../app/hooks';
import CampsiteCard from './CampsiteCard';
import {
  selectAllCampsites,
  selectCampsitesError,
  selectCampsitesLoading,
} from './campsitesSlice';
import Error from '../../components/Error';
import Loading from '../../components/Loading';

const CampsitesList: FC = () => {
  const campsites = useAppSelector(selectAllCampsites);
  const isLoading = useAppSelector(selectCampsitesLoading);
  const errMsg = useAppSelector(selectCampsitesError);

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

  return (
    <Row className="ms-auto">
      {campsites.map((campsite) => (
        <Col md="5" className="m-4" key={campsite.id}>
          <CampsiteCard campsite={campsite} />
        </Col>
      ))}
    </Row>
  );
};

export default CampsitesList;
