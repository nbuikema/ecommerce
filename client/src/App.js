import React, { useState, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { auth } from './firebase';
import { useDispatch } from 'react-redux';
import { currentUser } from './api/auth';
import { toast } from 'react-toastify';

import UserRoute from './components/auth/UserRoute';
import AdminRoute from './components/auth/AdminRoute';
import NoPage from './components/auth/NoPage';
import Header from './components/nav/Header';

import Home from './pages/core/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import RegisterComplete from './pages/auth/RegisterComplete';
import ForgotPassword from './pages/auth/ForgotPassword';
import UserDashboard from './pages/user/UserDashboard';
import Orders from './pages/user/Orders';
import Wishlist from './pages/user/Wishlist';
import AdminDashboard from './pages/admin/AdminDashboard';
import CreateCategory from './pages/admin/category/CreateCategory';
import UpdateCategory from './pages/admin/category/UpdateCategory';
import CreateSubcategory from './pages/admin/subcategory/CreateSubcategory';
import UpdateSubcategory from './pages/admin/subcategory/UpdateSubcategory';

const App = () => {
  const [ready, setReady] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const { token } = await user.getIdTokenResult();

        currentUser(token)
          .then(({ data: { _id, email, name, role } }) => {
            dispatch({
              type: 'LOGGED_IN_USER',
              payload: {
                _id,
                email,
                name,
                role,
                token
              }
            });

            setReady(true);
          })
          .catch((error) => {
            toast.error(error);
          });
      } else {
        setReady(true);
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return (
    <>
      <Header ready={ready} />
      <ToastContainer />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/register/complete" component={RegisterComplete} />
        <Route exact path="/forgot/password" component={ForgotPassword} />
        <UserRoute
          exact
          path="/user/dashboard"
          ready={ready}
          component={UserDashboard}
        />
        <UserRoute exact path="/user/orders" ready={ready} component={Orders} />
        <UserRoute
          exact
          path="/user/wishlist"
          ready={ready}
          component={Wishlist}
        />
        <AdminRoute
          exact
          path="/admin/dashboard"
          ready={ready}
          component={AdminDashboard}
        />
        <AdminRoute
          exact
          path="/admin/category"
          ready={ready}
          component={CreateCategory}
        />
        <AdminRoute
          exact
          path="/admin/category/:slug"
          ready={ready}
          component={UpdateCategory}
        />
        <AdminRoute
          exact
          path="/admin/subcategory"
          ready={ready}
          component={CreateSubcategory}
        />
        <AdminRoute
          exact
          path="/admin/subcategory/:slug"
          ready={ready}
          component={UpdateSubcategory}
        />
        <Route path="*" exact component={NoPage} />
      </Switch>
    </>
  );
};

export default App;
