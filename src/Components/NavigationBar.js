import React from "react";
import { NavLink, Navbar, Container } from "react-bootstrap";
import Nav from "react-bootstrap/Nav";

function NavigationBar() {
  return (
    <Navbar bg="light" data-bs-theme="light">
      <Container>
        <Nav className="me-auto">
          <NavLink href="/">Buyurtmalar</NavLink>
          <Nav.Link href="/product">Mahsulotlar</Nav.Link>
          <Nav.Link href="/category">Kategoriya</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
