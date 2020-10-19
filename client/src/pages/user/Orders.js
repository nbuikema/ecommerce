import React from 'react';

import UserNav from '../../components/nav/UserNav';

const Orders = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <UserNav />
        </div>
        <div className="col">My Orders</div>
      </div>
    </div>
  );
};

export default Orders;
