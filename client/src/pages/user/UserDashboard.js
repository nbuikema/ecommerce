import React, { useState } from 'react';
import { auth } from '../../firebase';
import { toast } from 'react-toastify';

import { Button } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';

const UserDashboard = () => {
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    await auth.currentUser
      .updatePassword(password)
      .then(() => {
        toast.success('Your password has been updated.');
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const infoForm = () => (
    <form>
      <div className="form-group">
        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type="password"
          className="form-control"
          placeholder="Password"
        />
      </div>
      <Button
        onClick={handleSubmit}
        type="primary"
        block
        shape="round"
        icon={<UserAddOutlined />}
        size="large"
        disabled={password.length < 6}
      >
        Update Password
      </Button>
    </form>
  );

  return (
    <div className="container mt-4">
      <h3 className="text-primary">My Info</h3>
      {infoForm()}
    </div>
  );
};

export default UserDashboard;
