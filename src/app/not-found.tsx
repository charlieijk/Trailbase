import { Container } from 'reactstrap';
import SubHeader from '../components/SubHeader';

const NotFound = () => (
  <Container>
    <SubHeader current="Page Not Found" hideBreadcrumbs />
    <p className="lead">
      The page you are looking for might have been removed, had its name changed, or is temporarily
      unavailable.
    </p>
  </Container>
);

export default NotFound;
