import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { EyeSlashFill, PencilFill } from 'react-bootstrap-icons';

const Accommodation = () => {
  return (
    <Card>
      <Card.Img variant="top" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFXmiZLC7bG8YMjqzV8xpmpzqIgxHCt-3chA&s" />
      <Card.Header>
        <Card.Title as="h5">Casa master</Card.Title>
      </Card.Header>
      <Card.Body>
        <Card.Text>Isso é um teste, você vai se surpreender com esta pousada.</Card.Text>
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
