import type { FC } from 'react';
import { Col, Row, Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { Link } from 'react-router-dom';

interface SubHeaderProps {
  current: string;
  detail?: boolean;
}

const SubHeader: FC<SubHeaderProps> = ({ current, detail = false }) => (
  <Row>
    <Col>
      <Breadcrumb>
        <BreadcrumbItem>
          <Link to="/">Home</Link>
        </BreadcrumbItem>
        {detail && (
          <BreadcrumbItem>
            <Link to="/directory">Directory</Link>
          </BreadcrumbItem>
        )}
        <BreadcrumbItem active>{current}</BreadcrumbItem>
      </Breadcrumb>
      <h2>{current}</h2>
      <hr />
    </Col>
  </Row>
);

export default SubHeader;
