import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container, Table, Badge, Modal, Form, Button, ButtonGroup,
} from 'react-bootstrap';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [currentClient, setCurrentClient] = useState({
    cardCode: '',
    cardName: '',
    cardType: '',
    phone1: '', 
    email: '',
    cardAddress: '',
  });
  const [editMode, setEditMode] = useState(false);

  const API_URL = 'http://localhost:5248/api/clients'; // backend .NET

  const fetchClients = async () => {
    try {
      const response = await axios.get(API_URL);
      setClients(response.data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const openCreateModal = () => {
    setEditMode(false);
    setCurrentClient({
      cardCode: '',
      cardName: '',
      cardType: '',
      phone1: '',
      email: '',
      cardAddress: '',
    });
    setShowModal(true);
  };

  const openEditModal = (client) => {
    setEditMode(true);
    setCurrentClient({ ...client });
    setShowModal(true);
  };

  const openDeleteModal = (client) => {
    setSelectedClient(client);
    setShowConfirmModal(true);
  };

  const closeModal = () => setShowModal(false);
  const closeConfirmModal = () => setShowConfirmModal(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentClient((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      if (editMode) {
        await axios.put(`${API_URL}/${currentClient.cardCode}`, currentClient);
      } else {
        await axios.post(API_URL, currentClient);
      }
      fetchClients();
      closeModal();
    } catch (error) {
      console.error('Error saving client:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/${selectedClient.cardCode}`);
      fetchClients();
    } catch (error) {
      console.error('Error deleting client:', error);
    } finally {
      closeConfirmModal();
    }
  };

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="fw-bold">Clientes</h2>
        <Button variant="primary" onClick={openCreateModal}>
          + Nuevo Cliente
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Type</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map(client => (
            <tr key={client.cardCode}>
              <td>{client.cardCode}</td>
              <td>{client.cardName}</td>
              <td>
                <Badge bg="info">{client.cardType}</Badge>
              </td>
              <td>{client.phone1}</td>
              <td>{client.email}</td>
              <td>{client.cardAddress}</td>
              <td>
                <ButtonGroup size="sm">
                  <Button
                    variant="success"
                    className="me-1"
                    onClick={() => openEditModal(client)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => openDeleteModal(client)}
                  >
                    Delete
                  </Button>
                </ButtonGroup>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal Crear/Editar */}
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? 'Editar Cliente' : 'Nuevo Cliente'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {!editMode && (
              <Form.Group className="mb-2">
                <Form.Label>CardCode</Form.Label>
                <Form.Control
                  type="text"
                  name="cardCode"
                  value={currentClient.cardCode}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            )}
            <Form.Group className="mb-2">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="cardName"
                value={currentClient.cardName}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Tipo</Form.Label>
              <Form.Control
                type="text"
                name="cardType"
                value={currentClient.cardType}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="text"
                name="phone1"
                value={currentClient.phone1}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={currentClient.email}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Dirección</Form.Label>
              <Form.Control
                type="text"
                name="cardAddress"
                value={currentClient.cardAddress}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>Cancelar</Button>
          <Button variant="primary" onClick={handleSave}>
            {editMode ? 'Actualizar' : 'Guardar'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Confirmación */}
      <Modal show={showConfirmModal} onHide={closeConfirmModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Seguro que deseas eliminar al cliente{' '}
          <strong>{selectedClient?.cardName}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeConfirmModal}>Cancelar</Button>
          <Button variant="danger" onClick={handleDelete}>Eliminar</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Clients;
