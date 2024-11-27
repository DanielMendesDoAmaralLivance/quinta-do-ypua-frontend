import { BASE_API_URL } from 'config/constant';
import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Col, Row, Form, ListGroup, Image } from 'react-bootstrap';
import { ClockFill, EyeSlashFill, MoonFill, PencilFill, PersonFill, SunFill } from 'react-bootstrap-icons';
import { Slide, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Accommodation = ({ accommodation }) => {
  const [showCreateReservationModal, setShowCreateReservationModal] = useState(false);
  const [showAccommodationModal, setShowAccommodationModal] = useState(false);

  const notify = () =>
    toast.success('Criado com sucesso!', {
      position: 'top-right',
      autoClose: 2500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: 'light',
      transition: Slide
    });

  return (
    <>
      <Card>
        <Card.Img variant="top" src={`${BASE_API_URL}/uploads/${accommodation.fileUrl}`} />
        <Card.Header>
          <Card.Title as="h5">{accommodation.name}</Card.Title>
        </Card.Header>
        <Card.Body>
          <Card.Text>{accommodation.description}</Card.Text>
        </Card.Body>
        <Card.Footer style={{ display: 'flex', justifyContent: 'space-evenly' }}>
          <Button variant="primary" onClick={() => setShowCreateReservationModal(true)}>
            + Reserva
          </Button>
          <Button variant="secondary">
            <PencilFill size={12} /> Editar
          </Button>
          <Button variant="light">
            <EyeSlashFill size={15} /> Inativar
          </Button>
        </Card.Footer>
      </Card>
      <CreateReservationModal
        show={showCreateReservationModal}
        handleClose={() => {
          setShowCreateReservationModal(false);
        }}
        accommodation={accommodation}
        notify={notify}
      />
      <AccommodationModal
        show={showAccommodationModal}
        handleClose={() => {
          setShowAccommodationModal(false);
        }}
        accommodation={accommodation}
      />
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="light"
        transition={Slide}
      />
    </>
  );
};

const CreateReservationModal = ({ show, handleClose, accommodation, notify }) => {
  const [guestsData, setGuestsData] = useState([]);

  const [guests, setGuests] = useState(0);
  const [predictedStartAt, setPredictedStartAt] = useState('');
  const [predictedEndAt, setPredictedEndAt] = useState('');
  const [includedLunch, setIncludedLunch] = useState(false);
  const [includedDinner, setIncludedDinner] = useState(false);
  const [responsibleGuestId, setResponsibleGuestId] = useState();

  const getGuestsData = async () => {
    const response = await fetch(`${BASE_API_URL}/guest`);
    const data = await response.json();

    setGuestsData(data);
  };

  const calculateDaysDifference = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const differenceInMilliseconds = end - start;

    const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);

    return Math.round(differenceInDays);
  };

  const money = (value) => {
    return (
      'R$' +
      value.toLocaleString({
        style: 'currency',
        currency: 'BRL'
      })
    );
  };

  const total = () => {
    const totalLunch = includedLunch ? calculateDaysDifference(new Date(predictedStartAt), new Date(predictedEndAt)) * guests * 35 : 0;
    const totalDinner = includedDinner ? calculateDaysDifference(new Date(predictedStartAt), new Date(predictedEndAt)) * guests * 35 : 0;
    const totalAccommodation = calculateDaysDifference(new Date(predictedStartAt), new Date(predictedEndAt)) * accommodation.pricePerNight;

    return totalDinner + totalLunch + totalAccommodation;
  };

  const submit = async () => {
    const response = await fetch(`${BASE_API_URL}/accommodation-reservation`, {
      method: 'POST',
      body: JSON.stringify({
        guests,
        predictedStartAt: new Date(predictedStartAt).toISOString(),
        predictedEndAt: new Date(predictedEndAt).toISOString(),
        totalPrice: total(),
        includedLunch,
        includedDinner,
        responsibleGuestId: Number(responsibleGuestId),
        accommodationId: accommodation.id
      }),
      headers: {
        'content-type': 'application/json'
      }
    });

    if (response.ok) {
      handleClose();
      notify();
    }
  };

  useEffect(() => {
    async function fetchData() {
      await getGuestsData();
    }
    fetchData();
  }, []);

  return (
    <>
      <Modal show={show} onHide={handleClose} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Criar reserva</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={8}>
              <Card>
                <Card.Header>
                  <Card.Title as="h5">Informe os dados da reserva</Card.Title>
                </Card.Header>
                <Card.Body>
                  <Form>
                    <Form.Group className="mb-3" controlId="responsibleGuestId">
                      <Form.Label>Hóspede responsável</Form.Label>
                      <Form.Control as="select" value={responsibleGuestId} onChange={(e) => setResponsibleGuestId(e.target.value)}>
                        {guestsData?.map((x, i) => {
                          return <option key={i} value={x.id}>{`${x.email} - ${x.firstName} ${x.lastName}`}</option>;
                        })}
                      </Form.Control>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="guests">
                      <Form.Label>Quantidade de hóspedes?</Form.Label>
                      <Form.Control type="number" placeholder="0" value={guests} onChange={(e) => setGuests(Number(e.target.value))} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="predictedStartAt">
                      <Form.Label>Data de check-in prevista</Form.Label>
                      <Form.Control type="date" value={predictedStartAt} onChange={(e) => setPredictedStartAt(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="predictedEndAt">
                      <Form.Label>Data de check-out prevista</Form.Label>
                      <Form.Control type="date" value={predictedEndAt} onChange={(e) => setPredictedEndAt(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="includedLunch">
                      <Form.Check
                        type="checkbox"
                        checked={includedLunch}
                        onChange={(e) => setIncludedLunch(e.target.checked)}
                        label="Incluir almoço? (+R$35,00 por pessoa, por dia)"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="includedDinner">
                      <Form.Check
                        type="checkbox"
                        checked={includedDinner}
                        onChange={(e) => setIncludedDinner(e.target.checked)}
                        label="Incluir jantar? (+R$35,00 por pessoa, por noite)"
                      />
                    </Form.Group>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <Card.Header>
                  <Card.Title as="h5">Resumo da reserva</Card.Title>
                </Card.Header>
                <Card.Body>
                  <ListGroup>
                    {guests ? (
                      <ListGroup.Item>
                        <PersonFill /> {guests} {guests === 1 ? 'hóspede' : 'hóspedes'}
                      </ListGroup.Item>
                    ) : (
                      <></>
                    )}

                    {predictedStartAt ? (
                      <ListGroup.Item>
                        <ClockFill /> Check-in: {new Date(predictedStartAt).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                      </ListGroup.Item>
                    ) : (
                      <></>
                    )}

                    {predictedEndAt ? (
                      <ListGroup.Item>
                        <ClockFill /> Check-out: {new Date(predictedEndAt).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                      </ListGroup.Item>
                    ) : (
                      <></>
                    )}
                    {includedLunch ? (
                      <ListGroup.Item>
                        <SunFill /> Almoço incluído
                      </ListGroup.Item>
                    ) : (
                      <></>
                    )}
                    {includedDinner ? (
                      <ListGroup.Item>
                        <MoonFill /> Jantar incluído
                      </ListGroup.Item>
                    ) : (
                      <></>
                    )}
                  </ListGroup>

                  {predictedStartAt && predictedEndAt ? (
                    <>
                      <div style={{ marginTop: 25 }}></div>
                      <ListGroup>
                        <ListGroup.Item style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Preço por noite </span>
                          <span>{money(accommodation.pricePerNight)}</span>
                        </ListGroup.Item>
                        <ListGroup.Item style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>x {calculateDaysDifference(new Date(predictedStartAt), new Date(predictedEndAt))} dias</span>
                          <span>
                            {money(
                              calculateDaysDifference(new Date(predictedStartAt), new Date(predictedEndAt)) * accommodation.pricePerNight
                            )}
                          </span>
                        </ListGroup.Item>
                      </ListGroup>
                    </>
                  ) : (
                    <></>
                  )}

                  {guests && includedLunch && predictedStartAt && predictedEndAt ? (
                    <>
                      <div style={{ marginTop: 25 }}></div>
                      <ListGroup>
                        <ListGroup.Item style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Almoço por pessoa/hóspede</span>
                          <span>R$35.00</span>
                        </ListGroup.Item>
                        <ListGroup.Item style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>
                            {calculateDaysDifference(new Date(predictedStartAt), new Date(predictedEndAt))} dias e {guests}{' '}
                            {guests === 1 ? 'hóspede' : 'hóspedes'}
                          </span>
                          <span>{money(calculateDaysDifference(new Date(predictedStartAt), new Date(predictedEndAt)) * guests * 35)}</span>
                        </ListGroup.Item>
                      </ListGroup>
                    </>
                  ) : (
                    <></>
                  )}

                  {guests && includedDinner && predictedStartAt && predictedEndAt ? (
                    <>
                      <div style={{ marginTop: 25 }}></div>
                      <ListGroup>
                        <ListGroup.Item style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Jantar por pessoa/hóspede</span>
                          <span>R$35.00</span>
                        </ListGroup.Item>
                        <ListGroup.Item style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>
                            {calculateDaysDifference(new Date(predictedStartAt), new Date(predictedEndAt))} dias e {guests}{' '}
                            {guests === 1 ? 'hóspede' : 'hóspedes'}
                          </span>
                          <span>{money(calculateDaysDifference(new Date(predictedStartAt), new Date(predictedEndAt)) * guests * 35)}</span>
                        </ListGroup.Item>
                      </ListGroup>
                    </>
                  ) : (
                    <></>
                  )}

                  {guests && predictedStartAt && predictedEndAt ? (
                    <>
                      <div style={{ marginTop: 25 }}></div>
                      <span style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <h4>TOTAL:</h4>
                        <h4>{money(total())}</h4>
                      </span>
                    </>
                  ) : (
                    <></>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Fechar
          </Button>
          <Button variant="primary" onClick={async () => await submit()}>
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export const AccommodationModal = ({ show, handleClose, accommodation }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [pricePerNight, setPricePerNight] = useState(0);
  const [checkin, setCheckin] = useState('');
  const [checkout, setCheckout] = useState('');
  const [guests, setGuests] = useState(0);
  const [beds, setBeds] = useState(0);
  const [minNights, setMinNights] = useState(0);
  const [file, setFile] = useState();
  const [previewImage, setPreviewImage] = useState();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);

    const previewUrl = URL.createObjectURL(selectedFile);
    setPreviewImage(previewUrl);
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{accommodation ? 'Editar' : 'Criar'} acomodação</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {true ? (
          <div
            style={{
              width: '100%',
              height: 300,
              backgroundImage: `url(${previewImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          ></div>
        ) : (
          <></>
        )}

        <Form>
          <Form.Group controlId="fileUrl" className="mb-3">
            <Form.Label>Escolha uma imagem para a acomodação</Form.Label>
            <Form.Control type="file" onChange={handleFileChange} />
          </Form.Group>

          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Nome</Form.Label>
            <Form.Control type="text" placeholder="Digite o nome" value={name} onChange={(e) => setName(e.target.value)} />
          </Form.Group>

          <Form.Group className="mb-3" controlId="description">
            <Form.Label>Descrição</Form.Label>
            <Form.Control
              as="textarea"
              placeholder="Digite a descrição"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>

          <Row>
            <Col>
              <Form.Group className="mb-3" controlId="checkin">
                <Form.Label>Horário de check-in</Form.Label>
                <Form.Control type="time" value={checkin} onChange={(e) => setCheckin(e.target.value)} />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3" controlId="checkout">
                <Form.Label>Horário de check-out</Form.Label>
                <Form.Control type="time" value={checkout} onChange={(e) => setCheckout(e.target.value)} />
              </Form.Group>
            </Col>
            <Col>
              {' '}
              <Form.Group className="mb-3" controlId="pricePerNight">
                <Form.Label>Preço por noite</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="0.00"
                  value={pricePerNight}
                  onChange={(e) => setPricePerNight(Number(e.target.value))}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group className="mb-3" controlId="guests">
                <Form.Label>Quantidade maxima de hóspedes</Form.Label>
                <Form.Control type="number" placeholder="0" value={guests} onChange={(e) => setGuests(Number(e.target.value))} />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3" controlId="beds">
                <Form.Label>Quantidade de camas</Form.Label>
                <Form.Control type="number" placeholder="0" value={beds} onChange={(e) => setBeds(Number(e.target.value))} />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3" controlId="minNights">
                <Form.Label>Quantidade mínima de noites</Form.Label>
                <Form.Control type="number" placeholder="0" value={minNights} onChange={(e) => setMinNights(Number(e.target.value))} />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Fechar
        </Button>
        <Button variant="primary" onClick={() => console.log(accommodation)}>
          Salvar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Accommodation;
