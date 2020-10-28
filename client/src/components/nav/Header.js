import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { auth } from '../../firebase';
import { useDispatch, useSelector } from 'react-redux';

import Search from '../forms/Search';

import { Menu, Badge, Affix } from 'antd';
import {
  AppstoreOutlined,
  SettingOutlined,
  UserOutlined,
  UserAddOutlined,
  LogoutOutlined,
  LoginOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined
} from '@ant-design/icons';
const { SubMenu, Item } = Menu;

const Header = () => {
  const [current, setCurrent] = useState('');

  const { user, cart } = useSelector((state) => ({ ...state }));

  const dispatch = useDispatch();

  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname === '/register/complete') {
      setCurrent('/register');
    } else if (pathname === '/checkout') {
      setCurrent('/cart');
    } else {
      setCurrent(pathname);
    }
  }, [pathname]);

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
      type: 'TOGGLE_SHOW',
      payload: true
    });
  };

  return (
    <Affix>
      <Menu selectedKeys={[current]} mode="horizontal">
        <Item
          className="float-left m-0 px-3"
          key="/"
          icon={<AppstoreOutlined />}
        >
          <Link to="/">Home</Link>
        </Item>
        <Item
          className="float-left m-0 px-3"
          key="/shop"
          icon={<ShoppingOutlined />}
        >
          <Link to="/shop">Shop</Link>
        </Item>
        <span className="float-left px-4">
          <Search />
        </span>
        {user ? (
          <SubMenu
            icon={<SettingOutlined />}
            title={user.email ? `${user.email}` : 'My Account'}
            className="float-right m-0 px-3"
          >
            <Item
              className="m-0 px-3"
              key="/user/dashboard"
              icon={<UserOutlined />}
            >
              <Link to="/user/dashboard">User Dashboard</Link>
            </Item>
            {user && user.role === 'admin' && (
              <Item
                className="m-0 px-3"
                key="/admin/dashboard"
                icon={<UserOutlined />}
              >
                <Link to="/admin/dashboard">Admin Dashboard</Link>
              </Item>
            )}
            <Item onClick={logout} icon={<LogoutOutlined />}>
              Logout
            </Item>
          </SubMenu>
        ) : (
          <>
            <Item
              key="/register"
              icon={<UserAddOutlined />}
              className="float-right m-0 px-3"
            >
              <Link to="/register">Register</Link>
            </Item>
            <Item
              key="/login"
              icon={<LoginOutlined />}
              className="float-right m-0 px-3"
            >
              <Link to="/login">Login</Link>
            </Item>
          </>
        )}
        <Item
          className="m-0 px-3 float-right"
          key="/cart"
          icon={<ShoppingCartOutlined />}
          onClick={handleDrawerToggle}
        >
          <Badge count={getCartQuantity()} offset={[12, 0]}>
            Cart
          </Badge>
        </Item>
      </Menu>
    </Affix>
  );
};

export default Header;
