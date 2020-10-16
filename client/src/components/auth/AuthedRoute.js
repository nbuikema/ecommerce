import React, { useEffect } from 'react';
import { Route, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AuthedRoute = ({ ...rest }) => {
  const { user } = useSelector((state) => ({ ...state }));

  const history = useHistory();

  useEffect(() => {
    if (!user) {
      history.push('/login');
    }
  }, [user, history]);

  return <Route {...rest} />;
};

export default AuthedRoute;
