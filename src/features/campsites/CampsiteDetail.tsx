import type { FC } from 'react';
import { Card, CardImg, CardText, CardBody, Col } from 'reactstrap';
import type { LegacyCampsite } from '../../types/legacy.types';

interface CampsiteDetailProps {
  campsite: LegacyCampsite;
}

const CampsiteDetail: FC<CampsiteDetailProps> = ({ campsite }) => {
  const { image, name, description } = campsite;

  return (
    <Col md="5" className="m-1">
      <Card>
        <CardImg top src={image} alt={name} />
        <CardBody>
          <CardText>{description}</CardText>
        </CardBody>
      </Card>
    </Col>
  );
};

export default CampsiteDetail;
