import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { auth } from '../../firebase';
import { useDispatch } from 'react-redux';
import { createOrUpdateUser } from '../../api/auth';

import { Button } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';

const RegisterComplete = ({ history }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const dispatch = useDispatch();

  useEffect(() => {
    if (window.localStorage.getItem('emailForRegistration')) {
      setEmail(window.localStorage.getItem('emailForRegistration'));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Email and Password are required.');

      return;
    }

    if (password.length < 6) {
      toast.error('Password must contain at least 6 characters.');

      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');

      setPassword('');
      setConfirmPassword('');

      return;
    }

    try {
      const result = await auth.signInWithEmailLink(
        email,
        window.location.href
      );

      if (result.user.emailVerified) {
        const user = auth.currentUser;
        const { token } = await user.getIdTokenResult();

        await user.updatePassword(password);

        createOrUpdateUser(token)
          .then(({ data: { _id, email, name, role } }) => {
            window.localStorage.removeItem('emailForRegistration');
            setEmail('');
            setPassword('');
            setConfirmPassword('');

            toast.success(`${email} has been successfully registered.`);

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

            history.push('/');
          })
          .catch((error) => {
            toast.error(error);
          });
      }
    } catch (error) {
      toast.error(
        'Invalid registration link. Please register this email again.'
      );
    }
  };

  const completeRegisterForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          value={email}
          placeholder="Email"
          type="email"
          className="form-control"
          disabled
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
          disabled={!email}
          autoFocus
        />
      </div>
      <div className="form-group">
        <input
          onChange={(e) => setConfirmPassword(e.target.value)}
          value={confirmPassword}
          placeholder="Confirm Password"
          type="password"
          className="form-control"
          autoComplete="new-password"
          disabled={!email}
        />
      </div>
      <Button
        onClick={handleSubmit}
        type="primary"
        className="mb-3"
        block
        shape="round"
        icon={<UserAddOutlined />}
        size="large"
        disabled={!email || !password || !confirmPassword}
      >
        Complete Registration
      </Button>
    </form>
  );

  return (
    <div className="container p-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h4>Complete Registration</h4>
          {completeRegisterForm()}
        </div>
      </div>
    </div>
  );
};

export default RegisterComplete;
