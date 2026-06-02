import React from 'react';
import { Link } from 'react-router';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          🎬 MovieReserve
        </Link>
        <div className="navbar-links">
          <Link to="/" className="navbar-link">
            Movies
          </Link>
          <Link to="/my-bookings" className="navbar-link">
            My Bookings
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;