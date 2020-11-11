import React from 'react';
import { useSelector } from 'react-redux';

import ProductCard from '../../components/cards/ProductCard';

const Orders = () => {
  const { user } = useSelector((state) => ({ ...state }));

  return (
    <div className="container mt-4">
      <h3 className="text-primary">My Wishlist</h3>
      <div className="row">
        {user.wishlist.map((product) => (
          <div key={product._id} className="col-md-4 pb-4 d-flex">
            <ProductCard product={product} showCustomer={true} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
