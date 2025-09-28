import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container, Table, Badge, Modal, Form, Button, ButtonGroup,
} from 'react-bootstrap';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState('active');
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentProduct, setCurrentProduct] = useState({
    itemCode: '',
    itemName: '',
    price: '',
    onHand: '',
    active: true,
  });
  const [editMode, setEditMode] = useState(false);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5248/api/item/todos');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openCreateModal = () => {
    setEditMode(false);
    setCurrentProduct({
      itemCode: '',
      itemName: '',
      price: '',
      onHand: '',
      active: true,
    });
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditMode(true);
    setCurrentProduct({ ...product });
    setShowModal(true);
  };

  const openDeactivateModal = (product) => {
    setSelectedProduct(product);
    setShowConfirmModal(true);
  };

  const closeModal = () => setShowModal(false);
  const closeConfirmModal = () => setShowConfirmModal(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentProduct((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = async () => {
    try {
      if (editMode) {
        await axios.put(`http://localhost:5248/api/item/${currentProduct.itemCode}`, currentProduct);
      } else {
        await axios.post('http://localhost:5248/api/item', currentProduct);
      }
      fetchProducts();
      closeModal();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5248/api/item/${selectedProduct.itemCode}`);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    } finally {
      closeConfirmModal();
    }
  };

  const handleActivate = async (itemCode) => {
    try {
      await axios.put(`http://localhost:5248/api/item/${itemCode}/activar`);
      fetchProducts();
    } catch (error) {
      console.error('Error activating product:', error);
    }
  };

  const filteredProducts = products.filter(p => {
    if (filter === 'all') return true;
    if (filter === 'active') return p.active === true;
    if (filter === 'inactive') return p.active === false;
    return true;
  });

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="fw-bold">Products</h2>
        <Button variant="primary" onClick={openCreateModal}>
          + Create Product
        </Button>
      </div>

      <div className="mb-3" style={{ maxWidth: '200px' }}>
        <Form.Select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="all">All</option>
        </Form.Select>
      </div>

      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map(product => (
            <tr key={product.itemCode}>
              <td>{product.itemCode}</td>
              <td>{product.itemName}</td>
              <td>Q{parseFloat(product.price).toFixed(2)}</td>
              <td>{product.onHand}</td>
              <td>
                <Badge bg={product.active ? 'success' : 'secondary'}>
                  {product.active ? 'Active' : 'Inactive'}
                </Badge>
              </td>
              <td>
                <ButtonGroup size="sm">
                  <Button
                    variant="success"
                    className="me-1"
                    onClick={() => openEditModal(product)}
                  >
                    Edit
                  </Button>
                  {product.active ? (
                    <Button
                      variant="warning"
                      onClick={() => openDeactivateModal(product)}
                    >
                      Deactivate
                    </Button>
                  ) : (
                    <Button
                      variant="secondary"
                      onClick={() => handleActivate(product.itemCode)}
                    >
                      Activate
                    </Button>
                  )}
                </ButtonGroup>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal para Crear/Editar */}
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? 'Edit Product' : 'Create Product'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="itemName"
                value={currentProduct.itemName}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="text"
                name="price"
                placeholder="Ej. 299.99"
                value={currentProduct.price}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*\.?\d{0,2}$/.test(value) || value === '') {
                    setCurrentProduct((prev) => ({
                      ...prev,
                      price: value
                    }));
                  }
                }}
                inputMode="decimal"
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="text"
                name="onHand"
                placeholder="Ej. 15"
                value={currentProduct.onHand}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value) || value === '') {
                    setCurrentProduct((prev) => ({
                      ...prev,
                      onHand: value
                    }));
                  }
                }}
                inputMode="numeric"
              />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Status</Form.Label>
              <Form.Check
                type="switch"
                name="active"
                id="active-switch"
                label={currentProduct.active ? 'Active' : 'Inactive'}
                checked={currentProduct.active}
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

      {/* Modal de confirmación */}
      <Modal show={showConfirmModal} onHide={closeConfirmModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deactivation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to deactivate <strong>{selectedProduct?.itemName}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeConfirmModal}>Cancel</Button>
          <Button variant="warning" onClick={handleDelete}>Yes, deactivate</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Products;