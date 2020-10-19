import React from 'react';
import { Link } from 'react-router-dom';

const UserNav = () => (
  <nav>
    <ul className="nav flex-column">
      <li className="nav-item">
        <Link className="nav-link" to="/user/dashboard">
          My Info
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/user/orders">
          My Orders
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/user/wishlist">
          My Wishlist
        </Link>
      </li>
    </ul>
  </nav>
);

export default UserNav;
