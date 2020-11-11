import React, { useState, useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { currentAdmin } from '../../api/auth';
import { toast } from 'react-toastify';

const AdminRoute = ({ ready, ...rest }) => {
  const [admin, setAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    if (ready) {
      if (user && user.token && user.role === 'admin') {
        currentAdmin(user.token)
          .then(() => {
            setAdmin(true);
            setLoading(false);
          })
          .catch((error) => {
            setAdmin(false);
            setLoading(false);

            toast.error(error.message);
          });
      } else {
        setLoading(false);
      }
    }
  }, [user, ready]);

  return !ready || loading ? null : user ? (
    user.role === 'admin' && admin ? (
      <Route {...rest} />
    ) : (
      <Redirect to="/user/dashboard" />
    )
  ) : (
    <Redirect to="/login" />
  );
};

export default AdminRoute;
