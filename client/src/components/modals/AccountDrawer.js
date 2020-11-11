import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { currentAdmin } from '../../api/auth';
import { toast } from 'react-toastify';

import { Drawer } from 'antd';
import AdminNav from '../nav/AdminNav';
import UserNav from '../nav/UserNav';

const AccountDrawer = ({ ready }) => {
  const [admin, setAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const { nav, user } = useSelector((state) => ({ ...state }));

  const dispatch = useDispatch();

  const location = useLocation();

  const unmounted = useRef(false);

  useEffect(() => {
    return () => {
      unmounted.current = true;
    };
  }, []);

  useEffect(() => {
    if (ready) {
      if (user && user.token && user.role === 'admin') {
        currentAdmin(user.token)
          .then(() => {
            if (!unmounted.current) {
              setAdmin(true);
              setLoading(false);
            }
          })
          .catch((error) => {
            if (!unmounted.current) {
              setAdmin(false);
              setLoading(false);
            }

            toast.error(error.message);
          });
      } else {
        if (!unmounted.current) {
          setLoading(false);
        }
      }
    }
  }, [user, ready]);

  const handleDrawerToggle = () => {
    dispatch({
      type: 'SHOW_NAV_OPTIONS',
      payload: false
    });
  };

  const handleClick = (path) => {
    if (path !== location.pathname) {
      handleDrawerToggle();
    }
  };

  return (
    <Drawer
      visible={nav}
      onClose={handleDrawerToggle}
      title="My Account"
      className="text-center"
      placement="right"
      width={375}
    >
      <UserNav location={location} handleClick={handleClick} />
      {admin && !loading && (
        <div className="mt-5">
          <AdminNav location={location} handleClick={handleClick} />
        </div>
      )}
    </Drawer>
  );
};

export default AccountDrawer;
