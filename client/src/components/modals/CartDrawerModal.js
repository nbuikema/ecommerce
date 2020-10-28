import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { updateCart } from '../../api/user';

import ProductCard from '../cards/ProductCard';

import { Drawer } from 'antd';

const CartDrawerModal = () => {
  const { cart, drawer, user } = useSelector((state) => ({ ...state }));

  const dispatch = useDispatch();

  const handleDrawerToggle = () => {
    dispatch({
      type: 'TOGGLE_SHOW',
      payload: false
    });
  };

  const emptyCart = () => {
    user &&
      updateCart(cart, null, user.token)
        .then((res) => {
          console.log(res);
        })
        .catch((error) => {
          console.log(error);
        });

    dispatch({
      type: 'EMPTY_CART'
    });
  };

  return (
    <Drawer
      visible={drawer}
      onClose={handleDrawerToggle}
      title="Cart"
      className="text-center"
      placement="right"
      width={400}
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
      <button
        to="/cart"
        className="text-center btn btn-sm btn-danger btn-raised float-right"
        onClick={emptyCart}
        disabled={!cart.length}
      >
        Empty Cart
      </button>
    </Drawer>
  );
};

export default CartDrawerModal;
