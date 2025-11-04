"use client";

import type { FC } from 'react';
import { Container } from 'reactstrap';
import DisplayList from '../features/display/DisplayList';
import SubHeader from '../components/SubHeader';

const HomePage: FC = () => (
  <Container>
    <SubHeader current="Welcome to Trailbase" hideBreadcrumbs />
    <DisplayList />
  </Container>
);

export default HomePage;
