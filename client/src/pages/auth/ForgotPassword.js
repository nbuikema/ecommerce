import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { auth } from '../../firebase';

import { Button } from 'antd';
import { MailOutlined } from '@ant-design/icons';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const config = {
      url: process.env.REACT_APP_FORGOT_PASSWORD_REDIRECT_URL,
      handleCodeInApp: true
    };

    await auth
      .sendPasswordResetEmail(email, config)
      .then(() => {
        setEmail('');

        toast.success(`A password reset link has been sent to ${email}.`);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const forgotPasswordForm = () => (
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
        icon={<MailOutlined />}
        size="large"
        disabled={!email}
      >
        Reset Password
      </Button>
    </form>
  );

  return (
    <div className="container p-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h4>Forgot Password</h4>
          {forgotPasswordForm()}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
