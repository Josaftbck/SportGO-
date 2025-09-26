import { NavLink } from 'react-router-dom';
import { Container, Nav, Navbar } from 'react-bootstrap';

function AppNavbar() {
  return (
    <Navbar bg="dark" variant="dark" expand="md" className="px-3">
      <Container fluid>
        <Navbar.Brand as={NavLink} to="/" className="fw-bold">
          SportGo
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav className="ms-auto">
            <Nav.Link as={NavLink} to="/" end>
              Home
            </Nav.Link>
            <Nav.Link as={NavLink} to="/productos">
              Productos
            </Nav.Link>
            <Nav.Link as={NavLink} to="/categorias">
              Categorías
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;