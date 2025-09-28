import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container, Table, Modal, Form, Button, ButtonGroup,
} from 'react-bootstrap';

const Branch = () => {
  const [branches, setBranches] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [currentBranch, setCurrentBranch] = useState({
    branchName: '',
    branchAddress: '',
  });
  const [editMode, setEditMode] = useState(false);

  const fetchBranches = async () => {
    try {
      const response = await axios.get('http://localhost:5248/api/branch');
      setBranches(response.data);
    } catch (error) {
      console.error('Error fetching branches:', error);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const openCreateModal = () => {
    setEditMode(false);
    setCurrentBranch({ branchName: '', branchAddress: '' });
    setShowModal(true);
  };

  const openEditModal = (branch) => {
    setEditMode(true);
    setCurrentBranch({ ...branch });
    setShowModal(true);
  };

  const openDeleteModal = (branch) => {
    setSelectedBranch(branch);
    setShowConfirmModal(true);
  };

  const closeModal = () => setShowModal(false);
  const closeConfirmModal = () => setShowConfirmModal(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentBranch((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      if (editMode) {
        await axios.put(`http://localhost:5248/api/branch/${currentBranch.branchID}`, currentBranch);
      } else {
        await axios.post('http://localhost:5248/api/branch', currentBranch);
      }
      fetchBranches();
      closeModal();
    } catch (error) {
      console.error('Error saving branch:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5248/api/branch/${selectedBranch.branchID}`);
      fetchBranches();
    } catch (error) {
      console.error('Error deleting branch:', error);
    } finally {
      closeConfirmModal();
    }
  };

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="fw-bold">Branches</h2>
        <Button variant="primary" onClick={openCreateModal}>
          + Create Branch
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {branches.map(branch => (
            <tr key={branch.branchID}>
              <td>{branch.branchID}</td>
              <td>{branch.branchName}</td>
              <td>{branch.branchAddress}</td>
              <td>
                <ButtonGroup size="sm">
                  <Button
                    variant="success"
                    className="me-1"
                    onClick={() => openEditModal(branch)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => openDeleteModal(branch)}
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
          <Modal.Title>{editMode ? 'Edit Branch' : 'Create Branch'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="branchName"
                value={currentBranch.branchName}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                name="branchAddress"
                value={currentBranch.branchAddress}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>
            {editMode ? 'Update' : 'Save'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Confirmación */}
      <Modal show={showConfirmModal} onHide={closeConfirmModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <strong>{selectedBranch?.branchName}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeConfirmModal}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Yes, delete</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Branch;