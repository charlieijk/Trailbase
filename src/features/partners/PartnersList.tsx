import type { FC } from 'react';
import { Col, Row } from 'reactstrap';
import { useAppSelector } from '../../app/hooks';
import Partner from './Partner';
import {
  selectAllPartners,
  selectPartnersError,
  selectPartnersLoading,
} from './partnersSlice';
import Error from '../../components/Error';
import Loading from '../../components/Loading';

const PartnersList: FC = () => {
  const partners = useAppSelector(selectAllPartners);
  const isLoading = useAppSelector(selectPartnersLoading);
  const errMsg = useAppSelector(selectPartnersError);

  if (isLoading) {
    return <Loading />;
  }

  if (errMsg) {
    return <Error errMsg={errMsg} />;
  }

  return (
    <Col className="mt-4">
      <Row>
        {partners.map((partner) => (
          <div className="d-flex mb-5" key={partner.id}>
            <Partner partner={partner} />
          </div>
        ))}
      </Row>
    </Col>
  );
};

export default PartnersList;
