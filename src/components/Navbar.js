import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './css/Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo">
          <Link to="/"> <img src="/assets/Logo.jpeg" alt="Description" /></Link>
        </div>
        <div className={`nav-links ${isOpen ? 'open' : ''}`}>
          <Link to="/">Home</Link>
        
        </div>
        <button className="menu-toggle" onClick={toggleMenu}>
          <span className="menu-icon">&#9776;</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
