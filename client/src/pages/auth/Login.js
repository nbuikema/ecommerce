import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { auth, googleAuthProvider } from '../../firebase';
import { useDispatch } from 'react-redux';

import { Button } from 'antd';
import { MailOutlined, GoogleOutlined } from '@ant-design/icons';

const Login = ({ history }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Email and Password are required.');

      return;
    }

    try {
      const { user } = await auth.signInWithEmailAndPassword(email, password);
      const idTokenResult = await user.getIdTokenResult();

      dispatch({
        type: 'LOGGED_IN_USER',
        payload: {
          email: user.email,
          token: idTokenResult.token
        }
      });

      history.push('/');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const googleLogin = async () => {
    try {
      await auth.signInWithPopup(googleAuthProvider).then(async ({ user }) => {
        const idTokenResult = await user.getIdTokenResult();

        dispatch({
          type: 'LOGGED_IN_USER',
          payload: {
            email: user.email,
            token: idTokenResult.token
          }
        });

        history.push('/');
      });
    } catch (error) {
      toast.error(error.message);
    }
  };

  const loginForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
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
