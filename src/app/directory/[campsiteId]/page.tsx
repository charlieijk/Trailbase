"use client";

import CampsiteDetailPage from '../../../pages/CampsiteDetailPage';

interface CampsiteDetailRouteProps {
  params: {
    campsiteId: string;
  };
}

const CampsiteDetailRoute = ({ params }: CampsiteDetailRouteProps) => {
  const numericId = Number(params.campsiteId);
  const campsiteId = Number.isNaN(numericId) ? undefined : numericId;

  return <CampsiteDetailPage campsiteId={campsiteId} />;
};

export default CampsiteDetailRoute;
