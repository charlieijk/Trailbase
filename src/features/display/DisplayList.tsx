"use client";

import type { FC } from 'react';
import { Col, Row } from 'reactstrap';
import { useAppSelector } from '../../state/hooks';
import AnimatedDisplayCard from './AnimatedDisplayCard';
import {
  selectFeaturedCampsite,
  selectCampsitesError,
  selectCampsitesLoading,
} from '../campsites/campsitesSlice';
import {
  selectFeaturedPromotion,
  selectPromotionsError,
  selectPromotionsLoading,
} from '../promotions/promotionsSlice';
import {
  selectFeaturedPartner,
  selectPartnersError,
  selectPartnersLoading,
} from '../partners/partnersSlice';
import Error from '../../components/Error';
import Loading from '../../components/Loading';

const DisplayList: FC = () => {
  const featuredCampsite = useAppSelector(selectFeaturedCampsite);
  const campsitesLoading = useAppSelector(selectCampsitesLoading);
  const campsitesError = useAppSelector(selectCampsitesError);

  const featuredPromotion = useAppSelector(selectFeaturedPromotion);
  const promotionsLoading = useAppSelector(selectPromotionsLoading);
  const promotionsError = useAppSelector(selectPromotionsError);

  const featuredPartner = useAppSelector(selectFeaturedPartner);
  const partnersLoading = useAppSelector(selectPartnersLoading);
  const partnersError = useAppSelector(selectPartnersError);

  const sections = [
    {
      item: featuredCampsite,
      isLoading: campsitesLoading,
      errMsg: campsitesError,
    },
    {
      item: featuredPromotion,
      isLoading: promotionsLoading,
      errMsg: promotionsError,
    },
    {
      item: featuredPartner,
      isLoading: partnersLoading,
      errMsg: partnersError,
    },
  ];

  return (
    <Row>
      {sections.map(({ item, isLoading, errMsg }, idx) => {
        if (isLoading) {
          return (
            <Col md className="m-1" key={`loading-${idx}`}>
              <Loading />
            </Col>
          );
        }
        if (errMsg) {
          return (
            <Col md className="m-1" key={`error-${idx}`}>
              <Error errMsg={errMsg} />
            </Col>
          );
        }
        if (!item) {
          return null;
        }

        return (
          <Col md className="m-1" key={item.id}>
            <AnimatedDisplayCard item={item} />
          </Col>
        );
      })}
    </Row>
  );
};

export default DisplayList;
