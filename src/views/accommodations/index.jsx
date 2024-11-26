import Accommodation from 'components/accommodation';
import React from 'react';
import { Row, Col } from 'react-bootstrap';

const AccommodationsPage = () => {
  return (
    <Row>
      <Col md={4}>
        <Accommodation />
      </Col>
    </Row>
  );
};

export default AccommodationsPage;
