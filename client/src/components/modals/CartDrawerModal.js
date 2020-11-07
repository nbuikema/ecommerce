import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { updateCart } from '../../api/user';
import { toast } from 'react-toastify';

import ProductCard from '../cards/ProductCard';

import { Drawer, Button } from 'antd';
import { ShoppingCartOutlined, CloseOutlined } from '@ant-design/icons';

const CartDrawerModal = () => {
  const {
    cart: { cart, showDrawer },
    user
  } = useSelector((state) => ({ ...state }));

  const dispatch = useDispatch();

  const handleDrawerToggle = () => {
    dispatch({
      type: 'SHOW_CART',
      payload: false
    });
  };

  const emptyCart = () => {
    dispatch({
      type: 'EMPTY_CART'
    });

    user &&
      updateCart(cart, null, user.token)
        .then((res) => {
          dispatch({
            type: 'GET_CART_FROM_DB',
            payload: res.data
          });
        })
        .catch((error) => {
          toast.error(error.message);
        });
  };

  return (
    <Drawer
      visible={showDrawer}
      onClose={handleDrawerToggle}
      title="My Cart"
      className="text-center"
      placement="right"
      width={375}
    >
      {!cart.length ? (
        <h6>
          Oops! Your cart is empty.
          <br />
          <Link to="/shop" onClick={handleDrawerToggle}>
            Continue Shopping
          </Link>
        </h6>
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
      <Link to="/cart">
        <Button
          type="primary"
          className="my-3"
          block
          shape="round"
          icon={<ShoppingCartOutlined />}
          size="large"
          onClick={handleDrawerToggle}
          disabled={!cart.length}
        >
          Review Order
        </Button>
      </Link>
      <Button
        onClick={emptyCart}
        type="danger"
        className="mb-3 float-right"
        shape="round"
        icon={<CloseOutlined />}
        size="small"
        disabled={!cart.length}
      >
        Empty Cart
      </Button>
    </Drawer>
  );
};

export default CartDrawerModal;
