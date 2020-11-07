import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { auth } from '../../../firebase';
import { useDispatch, useSelector } from 'react-redux';

import NavSearch from '../../forms/NavSearch/NavSearch';

import { Badge } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';

import './Header.css';

const Header = () => {
  const {
    user,
    cart: { cart }
  } = useSelector((state) => ({ ...state }));

  const dispatch = useDispatch();

  const { pathname } = useLocation();

  const logout = () => {
    auth.signOut();

    dispatch({
      type: 'LOGOUT',
      payload: null
    });
  };

  const getCartQuantity = () => {
    return cart.reduce((acc, item) => {
      return acc + item.quantity;
    }, 0);
  };

  const handleDrawerToggle = () => {
    dispatch({
      type: 'SHOW_CART',
      payload: true
    });
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light sticky-top">
      <Link className="navbar-brand" to="/">
        Home
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbar"
        aria-controls="navbar"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbar">
        <ul className="navbar-nav mr-auto">
          <li className={`nav-item ${pathname === '/' ? 'active' : ''}`}>
            <Link className="nav-link" to="/">
              Home
            </Link>
          </li>
          <li className={`nav-item ${pathname === '/shop' ? 'active' : ''}`}>
            <Link className="nav-link" to="/shop">
              Shop
            </Link>
          </li>
          <NavSearch />
        </ul>
        <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
          <li
            className={`nav-item ${
              pathname === '/cart' || pathname === '/checkout' ? 'active' : ''
            }`}
          >
            <div
              className="nav-link cart"
              onClick={handleDrawerToggle}
              style={{ cursor: 'pointer' }}
            >
              <ShoppingCartOutlined style={{ fontSize: '24px' }} />
              <Badge count={getCartQuantity()} offset={[0, -26]} />
            </div>
          </li>
          {user ? (
            <>
              <li
                className={`nav-item ${
                  pathname.includes('admin') || pathname.includes('user')
                    ? 'active'
                    : ''
                }`}
              >
                <div
                  className="nav-link dropdown-toggle"
                  id="navbarDropdown"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                  style={{ cursor: 'pointer' }}
                >
                  {user.email ? `${user.email}` : 'My Account'}
                </div>
                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <Link className="dropdown-item" to="/user/dashboard">
                    User Dashboard
                  </Link>
                  {user && user.role === 'admin' && (
                    <Link className="dropdown-item" to="/admin/dashboard">
                      Admin Dashboard
                    </Link>
                  )}
                </div>
              </li>
              <li className="nav-item">
                <div
                  className="nav-link"
                  onClick={logout}
                  style={{ cursor: 'pointer' }}
                >
                  Logout
                </div>
              </li>
            </>
          ) : (
            <>
              <li
                className={`nav-item ${
                  pathname === '/register' || pathname === '/register/complete'
                    ? 'active'
                    : ''
                }`}
              >
                <Link className="nav-link" to="/register">
                  Register
                </Link>
              </li>
              <li
                className={`nav-item ${pathname === '/login' ? 'active' : ''}`}
              >
                <Link className="nav-link" to="/login">
                  Login
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Header;
