import type { FC } from 'react';
import { Card, CardImg, CardImgOverlay, CardTitle } from 'reactstrap';
import { Link } from 'react-router-dom';
import type { LegacyCampsite } from '../../types/legacy.types';

interface CampsiteCardProps {
  campsite: LegacyCampsite;
}

const CampsiteCard: FC<CampsiteCardProps> = ({ campsite }) => {
  const { id, image, name } = campsite;

  return (
    <Link to={`${id}`}>
      <Card>
        <CardImg width="100%" src={image} alt={name} />
        <CardImgOverlay>
          <CardTitle>{name}</CardTitle>
        </CardImgOverlay>
      </Card>
    </Link>
  );
};

export default CampsiteCard;
