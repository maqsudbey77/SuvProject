import React from "react";
import { NavLink, Navbar, Container } from "react-bootstrap";
import Nav from "react-bootstrap/Nav";

function NavigationBar() {
  return (
    <Navbar className="Navbar">
      
          <NavLink className="Navlink"  href="/">Buyurtmalar</NavLink>
          <NavLink  className="Navlink" href="/product">Mahsulotlar</NavLink>
          <NavLink  className="Navlink" href="/category">Kategoriya</NavLink>
        
    </Navbar>
  );
}

export default NavigationBar;
