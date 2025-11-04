import type { FC } from 'react';
import Link from 'next/link';
import { Col, Row, Breadcrumb, BreadcrumbItem } from 'reactstrap';

interface SubHeaderProps {
  current: string;
  detail?: boolean;
  hideBreadcrumbs?: boolean;
}

const SubHeader: FC<SubHeaderProps> = ({ current, detail = false, hideBreadcrumbs = false }) => (
  <Row>
    <Col>
      {!hideBreadcrumbs && (
        <Breadcrumb>
          <BreadcrumbItem>
            <Link href="/" className="text-decoration-none">
              Home
            </Link>
          </BreadcrumbItem>
          {detail && (
            <BreadcrumbItem>
              <Link href="/directory" className="text-decoration-none">
                Directory
              </Link>
            </BreadcrumbItem>
          )}
          <BreadcrumbItem active>{current}</BreadcrumbItem>
        </Breadcrumb>
      )}
      <h2>{current}</h2>
      <hr />
    </Col>
  </Row>
);

export default SubHeader;
