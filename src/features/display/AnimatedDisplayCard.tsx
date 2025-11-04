"use client";

import type { FC, CSSProperties } from 'react';
import { useState, useEffect } from 'react';
import { Card, CardImg, CardText, CardBody, CardTitle } from 'reactstrap';
import type { LegacyDisplayItem } from '../../types/legacy.types';

interface AnimatedDisplayCardProps {
  item: LegacyDisplayItem;
}

const AnimatedDisplayCard: FC<AnimatedDisplayCardProps> = ({ item }) => {
  const { image, name, description } = item;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  const style: CSSProperties = {
    opacity: visible ? 1 : 0,
    transform: visible ? 'scale(1)' : 'scale(0.95)',
    transition: 'opacity 500ms ease-in-out, transform 500ms ease-in-out',
  };

  return (
    <div style={style}>
      <Card>
        <CardImg src={image} alt={name} />
        <CardBody>
          <CardTitle>{name}</CardTitle>
          <CardText>{description}</CardText>
        </CardBody>
      </Card>
    </div>
  );
};

export default AnimatedDisplayCard;
