import React from 'react';
import { Link } from 'react-router-dom';

const AdminNav = () => (
  <nav>
    <ul className="nav flex-column">
      <li className="nav-item">
        <Link className="nav-link" to="/admin/dashboard">
          Dashboard
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/admin/product">
          Product
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/admin/products">
          Products
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/admin/category">
          Category
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/admin/subcategory">
          Subcategory
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/admin/coupon">
          Coupon
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/admin/orders">
          Orders
        </Link>
      </li>
    </ul>
  </nav>
);

export default AdminNav;
