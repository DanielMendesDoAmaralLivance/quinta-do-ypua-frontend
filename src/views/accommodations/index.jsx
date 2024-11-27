import Accommodation, { AccommodationModal } from 'components/accommodation';
import React, { useState, useEffect } from 'react';
import { Row, Col, Spinner, Button } from 'react-bootstrap';
import { BASE_API_URL } from '../../config/constant';

const AccommodationsPage = () => {
  const [data, setData] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [showAccommodationModal, setShowAccommodationModal] = useState(false);

  const getAll = async () => {
    setIsLoading(true);
    const response = await fetch(`${BASE_API_URL}/accommodation`);
    const data = await response.json();

    setData(data);

    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  useEffect(() => {
    async function fetchData() {
      await getAll();
    }
    fetchData();
  }, []);

  return (
    <>
      <Button variant="primary" className="text-capitalize" onClick={() => setShowAccommodationModal(true)}>
        + Criar
      </Button>
      <Row>
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          data?.map((accommodation, index) => {
            return (
              <Col md={4} key={index}>
                <Accommodation accommodation={{ ...accommodation }} />
              </Col>
            );
          })
        )}
      </Row>
      <AccommodationModal
        show={showAccommodationModal}
        handleClose={() => {
          setShowAccommodationModal(false);
        }}
        accommodation={undefined}
      />
    </>
  );
};

export default AccommodationsPage;
