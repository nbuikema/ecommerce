import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import ProductCard from '../cards/ProductCard';

import { Drawer } from 'antd';

const CartDrawerModal = ({ children }) => {
  const { cart, drawer } = useSelector((state) => ({ ...state }));

  const dispatch = useDispatch();

  const handleDrawerToggle = () => {
    dispatch({
      type: 'TOGGLE_SHOW',
      payload: false
    });
  };

  return (
    <Drawer
      visible={drawer}
      onClose={handleDrawerToggle}
      title="Cart"
      className="text-center"
      placement="left"
      width={330}
    >
      {!cart.length ? (
        <p>
          No Products in Cart.{' '}
          <Link to="/shop" onClick={handleDrawerToggle}>
            Continue Shopping
          </Link>
        </p>
      ) : (
        cart.map((item) => (
          <div className="pb-3 d-flex" key={item.product._id}>
            <ProductCard
              product={item.product}
              showCart={true}
              quantity={item.quantity}
            />
          </div>
        ))
      )}
      <Link
        to="/cart"
        className="text-center btn btn-primary btn-raised btn-block"
        onClick={handleDrawerToggle}
        disabled={!cart.length}
      >
        Review Order
      </Link>
    </Drawer>
  );
};

export default CartDrawerModal;
