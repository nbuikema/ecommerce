import React from 'react';
import { Link } from 'react-router-dom';

const UserNav = ({ handleClick, location }) => {
  return (
    <>
      <h5 className="text-primary">User Options</h5>
      <hr />
      <nav>
        <ul className="nav flex-column">
          <li
            className={`nav-item ${
              location.pathname === '/user/dashboard' ? 'active' : ''
            }`}
          >
            <Link
              className="nav-link"
              to="/user/dashboard"
              onClick={() => handleClick('/user/dashboard')}
            >
              My Info
            </Link>
          </li>
          <li
            className={`nav-item ${
              location.pathname === '/user/orders' ? 'active' : ''
            }`}
          >
            <Link
              className="nav-link"
              to="/user/orders"
              onClick={() => handleClick('/user/orders')}
            >
              My Orders
            </Link>
          </li>
          <li
            className={`nav-item ${
              location.pathname === '/user/wishlist' ? 'active' : ''
            }`}
          >
            <Link
              className="nav-link"
              to="/user/wishlist"
              onClick={() => handleClick('/user/wishlist')}
            >
              My Wishlist
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default UserNav;
