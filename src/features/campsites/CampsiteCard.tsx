"use client";

import type { FC } from 'react';
import Link from 'next/link';
import { Card, CardImg, CardImgOverlay, CardTitle } from 'reactstrap';
import type { LegacyCampsite } from '../../types/legacy.types';

interface CampsiteCardProps {
  campsite: LegacyCampsite;
}

const CampsiteCard: FC<CampsiteCardProps> = ({ campsite }) => {
  const { id, image, name } = campsite;

  return (
    <Link href={`/directory/${id}`} className="text-decoration-none">
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
