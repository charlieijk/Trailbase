import type { FC, ReactNode } from 'react';
import { Col } from 'reactstrap';

interface ErrorProps {
  errMsg: ReactNode;
}

const Error: FC<ErrorProps> = ({ errMsg }) => (
  <Col>
    <h4>{errMsg}</h4>
  </Col>
);

export default Error;
