import { BASE_API_URL } from 'config/constant';
import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { EyeSlashFill, PencilFill } from 'react-bootstrap-icons';

const Accommodation = ({ accommodation }) => {
  return (
    <Card>
      <Card.Img variant="top" src={`${BASE_API_URL}/uploads/${accommodation.fileUrl}`} />
      <Card.Header>
        <Card.Title as="h5">{accommodation.name}</Card.Title>
      </Card.Header>
      <Card.Body>
        <Card.Text>{accommodation.description}</Card.Text>
      </Card.Body>
      <Card.Footer style={{ display: 'flex', justifyContent: 'space-evenly' }}>
        <Button variant="primary">+ Reserva</Button>
        <Button variant="secondary">
          <PencilFill size={12} /> Editar
        </Button>
        <Button variant="light">
          <EyeSlashFill size={15} /> Inativar
        </Button>
      </Card.Footer>
    </Card>
  );
};

export default Accommodation;
