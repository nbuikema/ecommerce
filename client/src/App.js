import React, { useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { auth } from './firebase';
import { useDispatch } from 'react-redux';

import NoPage from './components/auth/NoPage';
import AuthedRoute from './components/auth/AuthedRoute';
import UnAuthedRoute from './components/auth/UnAuthedRoute';
import Header from './components/nav/Header';

import Home from './pages/core/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import RegisterComplete from './pages/auth/RegisterComplete';
import ForgotPassword from './pages/auth/ForgotPassword';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const idTokenResult = await user.getIdTokenResult();

        dispatch({
          type: 'LOGGED_IN_USER',
          payload: {
            email: user.email,
            token: idTokenResult.token
          }
        });
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return (
    <>
      <Header />
      <ToastContainer />
      <Switch>
        <Route exact path="/" component={Home} />
        <UnAuthedRoute exact path="/login" component={Login} />
        <UnAuthedRoute exact path="/register" component={Register} />
        <UnAuthedRoute
          exact
          path="/register/complete"
          component={RegisterComplete}
        />
        <UnAuthedRoute
          exact
          path="/forgot/password"
          component={ForgotPassword}
        />
        <Route path="*" exact component={NoPage} />
      </Switch>
    </>
  );
};

export default App;
