import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

const UserRoute = ({ ready, ...rest }) => {
  const { user } = useSelector((state) => ({ ...state }));

  return !ready ? null : user && user.token ? (
    <Route {...rest} />
  ) : (
    <Redirect to="/login" />
  );
};

export default UserRoute;
