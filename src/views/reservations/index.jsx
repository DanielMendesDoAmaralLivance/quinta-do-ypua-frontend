import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Table, Spinner } from 'react-bootstrap';
import { BASE_API_URL } from 'config/constant';

const ReservationsPage = () => {
  const [data, setData] = useState([]);
  const [guestsData, setGuestsData] = useState([]);
  const [accommodationsData, setAccommodationsData] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const getAll = async () => {
    setIsLoading(true);

    const responseGuests = await fetch(`${BASE_API_URL}/guest`);
    const dataGuests = await responseGuests.json();
    setGuestsData(dataGuests);

    const responseAccommodations = await fetch(`${BASE_API_URL}/accommodation`);
    const dataAccommodations = await responseAccommodations.json();
    setAccommodationsData(dataAccommodations);

    const response = await fetch(`${BASE_API_URL}/accommodation-reservation`);
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

  const money = (value) => {
    return (
      'R$' +
      value.toLocaleString({
        style: 'currency',
        currency: 'BRL'
      })
    );
  };

  return (
    <React.Fragment>
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <Card.Title as="h5">Hóspedes</Card.Title>
            </Card.Header>
            <Card.Body>
              <Table responsive hover>
                {isLoading ? (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Spinner animation="border" variant="primary" />
                  </div>
                ) : (
                  <>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Acomodação</th>
                        <th>Hósp. responsável</th>
                        <th>Qtd. de hósp.</th>
                        <th>Check-in prev.</th>
                        <th>Check-out prev.</th>
                        <th>Check-in</th>
                        <th>Check-out</th>
                        <th>Refeições</th>
                        <th>Valor total</th>
                        <th>Status</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data?.map((reservation, index) => {
                        return (
                          <tr key={index}>
                            <th scope="row">{String(reservation.id).padStart(4, '0')}</th>
                            <td>{accommodationsData?.find((x) => x.accommodationId === reservation.accommodationId)?.name}</td>
                            <td>{guestsData?.find((x) => x.id === reservation.resposibleGuestId)?.email}</td>
                            <td>{reservation.guests}</td>
                            <td>
                              {new Intl.DateTimeFormat('pt-BR', {
                                timeZone: 'UTC',
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric'
                              }).format(new Date(reservation.predictedStartAt))}
                            </td>
                            <td>
                              {new Intl.DateTimeFormat('pt-BR', {
                                timeZone: 'UTC',
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric'
                              }).format(new Date(reservation.predictedEndAt))}
                            </td>
                            <td>
                              {reservation.startedAt
                                ? new Intl.DateTimeFormat('pt-BR', {
                                    timeZone: 'UTC',
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric'
                                  }).format(new Date(reservation.startedAt))
                                : '-----'}
                            </td>
                            <td>
                              {reservation.endedAt
                                ? new Intl.DateTimeFormat('pt-BR', {
                                    timeZone: 'UTC',
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric'
                                  }).format(new Date(reservation.endedAt))
                                : '-----'}
                            </td>
                            <td>
                              {reservation.includedLunch && reservation.includedDinner
                                ? 'Almoço/Jantar'
                                : reservation.includedLunch
                                  ? 'Almoço'
                                  : reservation.includedDinner
                                    ? 'Jantar'
                                    : '-----'}
                            </td>
                            <td>{money(reservation.totalPrice)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </>
                )}
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default ReservationsPage;
