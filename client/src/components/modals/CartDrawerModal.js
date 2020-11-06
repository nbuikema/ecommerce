import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { updateCart } from '../../api/user';

import ProductCard from '../cards/ProductCard';

import { Drawer } from 'antd';

const CartDrawerModal = () => {
  const {
    cart: { cart, showDrawer },
    user
  } = useSelector((state) => ({ ...state }));

  const dispatch = useDispatch();

  const handleDrawerToggle = () => {
    dispatch({
      type: 'TOGGLE_CART'
    });
  };

  const emptyCart = () => {
    user &&
      updateCart(cart, null, user.token)
        .then(() => {
          dispatch({
            type: 'EMPTY_CART'
          });
        })
        .catch((error) => {
          console.log(error);
        });
  };

  return (
    <Drawer
      visible={showDrawer}
      onClose={handleDrawerToggle}
      title="Cart"
      className="text-center"
      placement="right"
      width={375}
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
