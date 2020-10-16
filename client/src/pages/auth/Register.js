import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { auth } from '../../firebase';

import { Button } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';

const Register = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const config = {
      url: process.env.REACT_APP_REGISTER_REDIRECT_URL,
      handleCodeInApp: true
    };

    await auth
      .sendSignInLinkToEmail(email, config)
      .then(() => {
        window.localStorage.setItem('emailForRegistration', email);

        setEmail('');

        toast.success(
          `A confirmation link has been sent to ${email}. Please click the link to complete registration.`,
          {
            autoClose: false
          }
        );
      })
      .catch(() => {
        toast.error('Oops! There was an issue registering this email.', {
          autoClose: false
        });
      });
  };

  const registerForm = () => (
    <form>
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
      <Button
        onClick={handleSubmit}
        type="primary"
        className="mb-3"
        block
        shape="round"
        icon={<UserAddOutlined />}
        size="large"
        disabled={!email}
      >
        Register
      </Button>
    </form>
  );

  return (
    <div className="container p-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h4>Register</h4>
          {registerForm()}
        </div>
      </div>
    </div>
  );
};

export default Register;
