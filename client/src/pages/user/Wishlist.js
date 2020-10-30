import React from 'react';
import { useSelector } from 'react-redux';

import UserNav from '../../components/nav/UserNav';
import ProductCard from '../../components/cards/ProductCard';

const Orders = () => {
  const { user } = useSelector((state) => ({ ...state }));

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <UserNav />
        </div>
        <div className="col">
          <h4>My Wishlist</h4>
          <div className="row">
            {user.wishlist.map((product) => (
              <div key={product._id} className="col-md-4 pb-4 d-flex">
                <ProductCard product={product} showCustomer={true} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
