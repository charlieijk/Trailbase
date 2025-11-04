"use client";

import type { FC } from 'react';
import { Container } from 'reactstrap';
import SubHeader from '../components/SubHeader';
import CampsitesList from '../features/campsites/CampsitesList';

const DirectoryPage: FC = () => (
  <Container>
    <SubHeader current="Directory" />
    <CampsitesList />
  </Container>
);

export default DirectoryPage;
