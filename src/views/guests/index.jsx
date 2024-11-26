import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Table, Button, Modal, Form, Spinner } from 'react-bootstrap';
import { BASE_API_URL } from '../../config/constant';
import { PencilFill, TrashFill } from 'react-bootstrap-icons';

const GuestsPage = () => {
  const [data, setData] = useState();

  const [showGuestModal, setShowGuestModal] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [id, setId] = useState(undefined);
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [email, setEmail] = useState();
  const [document, setDocument] = useState();

  const getAll = async () => {
    setIsLoading(true);
    const response = await fetch(`${BASE_API_URL}/guest`);
    const data = await response.json();

    setData(data);

    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const submit = async () => {
    let url;
    if (id) url = `${BASE_API_URL}/guest/${id}`;
    else url = `${BASE_API_URL}/guest`;

    const method = id ? 'PUT' : 'POST';

    await fetch(url, {
      method,
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        document
      }),
      headers: {
        'content-type': 'application/json'
      }
    });

    handleCloseGuestModal();
    await getAll();
  };

  const deleteGuest = async (id) => {
    const wantsDelete = window.confirm(`Tem certeza de que deseja confirmar a deleção de #${String(id).padStart(3, '0')}?`);

    if (!wantsDelete) return;

    await fetch(`${BASE_API_URL}/guest/${id}`, {
      method: 'DELETE'
    });

    await getAll();
  };

  useEffect(() => {
    async function fetchData() {
      await getAll();
    }
    fetchData();
  }, []);

  const handleCloseGuestModal = () => {
    setShowGuestModal(false);
    setId(undefined);
    setFirstName(undefined);
    setLastName(undefined);
    setEmail(undefined);
    setDocument(undefined);
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
              <Button variant="primary" className="text-capitalize" onClick={() => setShowGuestModal(true)}>
                + Criar
              </Button>

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
                        <th>Nome</th>
                        <th>Sobrenome</th>
                        <th>Email</th>
                        <th>CPF</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data?.map((guest, index) => {
                        return (
                          <tr key={index}>
                            <th scope="row">{String(guest.id).padStart(3, '0')}</th>
                            <td>{guest.firstName}</td>
                            <td>{guest.lastName}</td>
                            <td>{guest.email}</td>
                            <td>{guest.document}</td>
                            <td>
                              <PencilFill
                                color="#04a9f5"
                                size={18}
                                style={{ cursor: 'pointer' }}
                                onClick={() => {
                                  setShowGuestModal(true);
                                  setId(guest.id);
                                  setFirstName(guest.firstName);
                                  setLastName(guest.lastName);
                                  setEmail(guest.email);
                                  setDocument(guest.document);
                                }}
                              />
                              <span> </span>
                              <TrashFill
                                color="red"
                                size={18}
                                style={{ cursor: 'pointer' }}
                                onClick={async () => {
                                  await deleteGuest(guest.id);
                                }}
                              />
                            </td>
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
      <Modal show={showGuestModal} onHide={handleCloseGuestModal}>
        <Modal.Header closeButton>
          <Modal.Title>{id ? 'Editar hóspede' : 'Criar novo hóspede'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="firstName">
              <Form.Label>Nome</Form.Label>
              <Form.Control type="text" placeholder="Nome" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="lastName">
              <Form.Label>Sobrenome</Form.Label>
              <Form.Control type="text" placeholder="Sobrenome" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="email">
              <Form.Label>CPF</Form.Label>
              <Form.Control type="text" placeholder="CPF" value={document} onChange={(e) => setDocument(e.target.value)} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseGuestModal}>
            Fechar
          </Button>
          <Button variant="primary" onClick={async () => await submit()}>
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
};

export default GuestsPage;
