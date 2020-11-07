import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { auth, googleAuthProvider } from '../../firebase';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { createOrUpdateUser } from '../../api/auth';

import { Button } from 'antd';
import { MailOutlined, GoogleOutlined } from '@ant-design/icons';

const Login = ({ history }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();

  const roleBasedRedirect = (role) => {
    const redirectPage = history.location.state;
    if (redirectPage) {
      history.push(redirectPage.from);
    } else {
      if (role === 'admin') {
        history.push('/admin/dashboard');
      } else {
        history.push('/user/dashboard');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Email and Password are required.');

      return;
    }

    try {
      const { user } = await auth.signInWithEmailAndPassword(email, password);
      const { token } = await user.getIdTokenResult();

      createOrUpdateUser(token)
        .then(
          ({
            data: {
              _id,
              email,
              name,
              role,
              cart,
              address,
              orders,
              wishlist,
              lastLogin
            }
          }) => {
            dispatch({
              type: 'LOGGED_IN_USER',
              payload: {
                _id,
                email,
                name,
                role,
                address,
                orders,
                wishlist,
                lastLogin,
                token
              }
            });

            dispatch({
              type: 'GET_CART_FROM_DB',
              payload: cart
            });

            roleBasedRedirect(role);
          }
        )
        .catch((error) => {
          toast.error(error);
        });
    } catch (error) {
      toast.error(error.message);
    }
  };

  const googleLogin = async () => {
    try {
      await auth.signInWithPopup(googleAuthProvider).then(async ({ user }) => {
        const { token } = await user.getIdTokenResult();

        createOrUpdateUser(token)
          .then(
            ({
              data: {
                _id,
                email,
                name,
                role,
                cart,
                address,
                orders,
                wishlist,
                lastLogin
              }
            }) => {
              dispatch({
                type: 'LOGGED_IN_USER',
                payload: {
                  _id,
                  email,
                  name,
                  role,
                  address,
                  orders,
                  wishlist,
                  lastLogin,
                  token
                }
              });

              dispatch({
                type: 'GET_CART_FROM_DB',
                payload: cart
              });

              roleBasedRedirect(role);
            }
          )
          .catch((error) => {
            toast.error(error);
          });
      });
    } catch (error) {
      toast.error(error.message);
    }
  };

  const loginForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Email</label>
        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          placeholder="Email"
          type="email"
          className="form-control"
          autoFocus
        />
      </div>
      <div className="form-group">
        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          placeholder="Password"
          type="password"
          className="form-control"
          autoComplete="new-password"
        />
      </div>
      <Button
        onClick={handleSubmit}
        type="primary"
        className="mb-3"
        block
        shape="round"
        icon={<MailOutlined />}
        size="large"
        disabled={!email || !password}
      >
        Login with Email/Password
      </Button>
      <Button
        onClick={googleLogin}
        type="danger"
        className="mb-3"
        block
        shape="round"
        icon={<GoogleOutlined />}
        size="large"
      >
        Login with Google
      </Button>
      <Link
        to="/forgot/password"
        className="float-right text-danger font-weight-bold"
      >
        Forgot Password?
      </Link>
    </form>
  );

  return (
    <div className="container p-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h4>Login</h4>
          {loginForm()}
        </div>
      </div>
    </div>
  );
};

export default Login;
