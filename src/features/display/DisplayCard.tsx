import type { FC } from 'react';
import { Card, CardImg, CardText, CardBody, CardTitle } from 'reactstrap';
import type { LegacyDisplayItem } from '../../types/legacy.types';

interface DisplayCardProps {
  item: LegacyDisplayItem;
}

const DisplayCard: FC<DisplayCardProps> = ({ item }) => {
  const { image, name, description } = item;

  return (
    <Card>
      <CardImg src={image} alt={name} />
      <CardBody>
        <CardTitle>{name}</CardTitle>
        <CardText>{description}</CardText>
      </CardBody>
    </Card>
  );
};

export default DisplayCard;
