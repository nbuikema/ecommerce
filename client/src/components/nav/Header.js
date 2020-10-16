import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { auth } from '../../firebase';
import { useDispatch, useSelector } from 'react-redux';

import { Menu } from 'antd';
import {
  AppstoreOutlined,
  SettingOutlined,
  UserAddOutlined,
  LogoutOutlined,
  LoginOutlined
} from '@ant-design/icons';
const { SubMenu, Item } = Menu;

const Header = () => {
  const [current, setCurrent] = useState('');

  let { user } = useSelector((state) => ({ ...state }));

  const dispatch = useDispatch();

  let {
    location: { pathname }
  } = useHistory();

  useEffect(() => {
    if (pathname === '/register/complete') {
      return setCurrent('/register');
    }
    setCurrent(pathname);
  }, [pathname]);

  const handleClick = (e) => {
    setCurrent(e.key);
  };

  const logout = () => {
    auth.signOut();

    dispatch({
      type: 'LOGOUT',
      payload: null
    });
  };

  return (
    <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal">
      <Item key="/home" icon={<AppstoreOutlined />}>
        <Link to="/">Home</Link>
      </Item>
      {user ? (
        <SubMenu
          icon={<SettingOutlined />}
          title={user.email ? `${user.email}` : 'My Account'}
          className="float-right"
        >
          <Item onClick={logout} icon={<LogoutOutlined />}>
            Logout
          </Item>
        </SubMenu>
      ) : (
        <>
          <Item
            key="/register"
            icon={<UserAddOutlined />}
            className="float-right"
          >
            <Link to="/register">Register</Link>
          </Item>
          <Item key="/login" icon={<LoginOutlined />} className="float-right">
            <Link to="/login">Login</Link>
          </Item>
        </>
      )}
    </Menu>
  );
};

export default Header;
