import { useSelector } from 'react-redux';
import React from 'react';
import { Col, Row } from 'reactstrap';
import Partner from './Partner';
import { selectAllPartners } from './partnersSlice';
import Error from '../../components/Error';
import Loading from '../../components/Loading';

const PartnersList = () => {
    const partners = useSelector(selectAllPartners);
    const isLoading = useSelector((state) => state.partners.isLoading);
    const errMsg = useSelector((state) => state.partners.errMsg);


    return isLoading ? (
      <Loading />
  ) : errMsg ? (
      <Error errMsg={errMsg} />
  ) : (
      <Col className='mt-4'>
          <Row>
              {partners.map((partner) => {
                  return (
                      <div className='d-flex mb-5' key={partner.id}>
                          <Partner partner={partner} />
                      </div>
                  );
              })}
          </Row>
      </Col>
  );
};
  
  export default PartnersList;