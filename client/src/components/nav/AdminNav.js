import React from 'react';
import { Link } from 'react-router-dom';

const AdminNav = ({ handleClick, location }) => {
  return (
    <>
      <h5 className="text-primary">Admin Options</h5>
      <hr />
      <nav>
        <ul className="nav flex-column">
          <li
            className={`nav-item ${
              location.pathname === '/admin/dashboard' ? 'active' : ''
            }`}
          >
            <Link
              className="nav-link"
              to="/admin/dashboard"
              onClick={() => handleClick('/admin/dashboard')}
            >
              Dashboard
            </Link>
          </li>
          <li
            className={`nav-item ${
              location.pathname === '/admin/product' ? 'active' : ''
            }`}
          >
            <Link
              className="nav-link"
              to="/admin/product"
              onClick={() => handleClick('/admin/product')}
            >
              Product
            </Link>
          </li>
          <li
            className={`nav-item ${
              location.pathname === '/admin/products' ? 'active' : ''
            }`}
          >
            <Link
              className="nav-link"
              to="/admin/products"
              onClick={() => handleClick('/admin/products')}
            >
              Products
            </Link>
          </li>
          <li
            className={`nav-item ${
              location.pathname === '/admin/category' ? 'active' : ''
            }`}
          >
            <Link
              className="nav-link"
              to="/admin/category"
              onClick={() => handleClick('/admin/category')}
            >
              Category
            </Link>
          </li>
          <li
            className={`nav-item ${
              location.pathname === '/admin/subcategory' ? 'active' : ''
            }`}
          >
            <Link
              className="nav-link"
              to="/admin/subcategory"
              onClick={() => handleClick('/admin/subcategory')}
            >
              Subcategory
            </Link>
          </li>
          <li
            className={`nav-item ${
              location.pathname === '/admin/coupon' ? 'active' : ''
            }`}
          >
            <Link
              className="nav-link"
              to="/admin/coupon"
              onClick={() => handleClick('/admin/coupon')}
            >
              Coupon
            </Link>
          </li>
          <li
            className={`nav-item ${
              location.pathname === '/admin/orders' ? 'active' : ''
            }`}
          >
            <Link
              className="nav-link"
              to="/admin/orders"
              onClick={() => handleClick('/admin/orders')}
            >
              Orders
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default AdminNav;
