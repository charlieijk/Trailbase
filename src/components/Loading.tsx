import type { FC } from 'react';
import { Col } from 'reactstrap';

const Loading: FC = () => (
  <Col>
    <i className="fa fa-spinner fa-pulse fa-3x fa-fw text-primary" />
    <p>Loading...</p>
  </Col>
);

export default Loading;
