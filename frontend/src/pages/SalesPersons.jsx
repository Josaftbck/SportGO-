import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container, Table, Modal, Form, Button, ButtonGroup
} from 'react-bootstrap';

const SalesPersons = () => {
  const [salesPersons, setSalesPersons] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentSalesPerson, setCurrentSalesPerson] = useState({
    SlpName: '',
    Position: '',
    AdmissionDate: '',
    UserID: ''
  });
  const [editMode, setEditMode] = useState(false);

  const API_URL = 'http://localhost:5248/api/SalesPerson';

  const fetchSalesPersons = async () => {
    try {
      const response = await axios.get(API_URL);
      setSalesPersons(response.data);
      console.log('Datos recibidos:', response.data);
    } catch (error) {
      console.error('Error fetching sales persons:', error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchSalesPersons();
  }, []);

  const openCreateModal = () => {
    setEditMode(false);
    setCurrentSalesPerson({
      SlpName: '',
      Position: '',
      AdmissionDate: '',
      UserID: ''
    });
    setShowModal(true);
  };

  const openEditModal = (sp) => {
    setEditMode(true);
    setCurrentSalesPerson({ ...sp, AdmissionDate: sp.AdmissionDate?.split('T')[0] });
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentSalesPerson((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      if (editMode) {
        await axios.put(`${API_URL}/${currentSalesPerson.SlpCode}`, currentSalesPerson);
      } else {
        await axios.post(API_URL, currentSalesPerson);
      }
      fetchSalesPersons();
      closeModal();
    } catch (error) {
      console.error('Error saving sales person:', error.response?.data || error.message);
    }
  };

  const handleDelete = async (SlpCode) => {
    try {
      await axios.delete(`${API_URL}/${SlpCode}`);
      fetchSalesPersons();
    } catch (error) {
      console.error('Error deleting sales person:', error.response?.data || error.message);
    }
  };

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="fw-bold">Sales Persons</h2>
        <Button variant="primary" onClick={openCreateModal}>
          + Add Sales Person
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Position</th>
            <th>Admission Date</th>
            <th>UserID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {salesPersons.map(sp => (
                <tr key={sp.slpCode}>
                <td>{sp.slpCode}</td>
                <td>{sp.slpName}</td>
                <td>{sp.position}</td>
                <td>{sp.admissionDate ? sp.admissionDate.split('T')[0] : ''}</td>
                <td>{sp.userID}</td>
              <td>
                <ButtonGroup size="sm">
                  <Button variant="success" className="me-1" onClick={() => openEditModal(sp)}>Edit</Button>
                  <Button variant="danger" onClick={() => handleDelete(sp.SlpCode)}>Delete</Button>
                </ButtonGroup>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal Crear/Editar */}
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? 'Edit Sales Person' : 'Add Sales Person'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="SlpName"
                value={currentSalesPerson.SlpName}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Position</Form.Label>
              <Form.Control
                type="text"
                name="Position"
                value={currentSalesPerson.Position}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Admission Date</Form.Label>
              <Form.Control
                type="date"
                name="AdmissionDate"
                value={currentSalesPerson.AdmissionDate}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>UserID</Form.Label>
              <Form.Control
                type="number"
                name="UserID"
                value={currentSalesPerson.UserID}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>{editMode ? 'Update' : 'Save'}</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default SalesPersons;
