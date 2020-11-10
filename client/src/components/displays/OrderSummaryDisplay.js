import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { getCoupon } from '../../api/coupon';
import { toast } from 'react-toastify';

import { Button } from 'antd';
import { ShoppingOutlined } from '@ant-design/icons';

const OrderSummaryDisplay = () => {
  const [newCoupon, setNewCoupon] = useState('');

  const {
    cart: { cart, coupon },
    user
  } = useSelector((state) => ({ ...state }));

  const dispatch = useDispatch();

  const history = useHistory();

  const getCartSubtotal = () => {
    return (
      cart &&
      Math.round(
        cart.reduce((acc, item) => {
          return acc + item.quantity * item.product.price;
        }, 0) * 100
      ) / 100
    );
  };

  const getTotalSaved = () => {
    return (
      cart &&
      coupon.discount &&
      Math.round(getCartSubtotal() * (coupon.discount / 100) * 100) / 100
    );
  };

  const getTax = () => {
    return cart
      ? coupon.discount
        ? Math.round((getCartSubtotal() - getTotalSaved()) * 0.0625 * 100) / 100
        : Math.round(getCartSubtotal() * 0.0625 * 100) / 100
      : null;
  };

  const getTotal = () => {
    return cart
      ? coupon.discount
        ? Math.round((getCartSubtotal() - getTotalSaved() + getTax()) * 100) /
          100
        : Math.round((getCartSubtotal() + getTax()) * 100) / 100
      : null;
  };

  const handleDrawerToggle = () => {
    dispatch({
      type: 'SHOW_CART',
      payload: false
    });
  };

  const handleCoupon = () => {
    getCoupon(newCoupon)
      .then((coupon) => {
        if (coupon.data) {
          dispatch({
            type: 'ADD_COUPON',
            payload: coupon.data
          });

          toast.success(`${coupon.data.name} Applied!`);
        } else {
          toast.error('Invalid Coupon.');
        }
      })
      .catch((error) => {
        toast.error(error.response.data.error);
      });
  };

  return (
    <>
      <h3 className="text-primary">Order Summary</h3>
      <hr />
      <h6>Enter Coupon</h6>
      <div className="row">
        <div className="col coupon">
          <input
            type="text"
            placeholder={coupon && coupon.name}
            className="form-control"
            onChange={(e) => setNewCoupon(e.target.value)}
          />
        </div>
        <div className="col text-center">
          {coupon.name && coupon.discount ? (
            <Button
              type="primary"
              className="my-3 bg-danger border-danger"
              block
              shape="round"
              icon={<ShoppingOutlined />}
              size="medium"
              onClick={() =>
                dispatch({
                  type: 'REMOVE_COUPON'
                })
              }
              disabled={!cart.length}
              style={{
                maxWidth: '200px'
              }}
            >
              Remove Coupon
            </Button>
          ) : (
            <Button
              type="primary"
              className="my-3 bg-success border-success"
              block
              shape="round"
              icon={<ShoppingOutlined />}
              size="medium"
              onClick={handleCoupon}
              disabled={!cart.length}
              style={{
                maxWidth: '200px'
              }}
            >
              Apply Coupon
            </Button>
          )}
        </div>
      </div>
      {coupon && coupon.discount ? (
        <h6 className="mt-2">Discount: {coupon.discount}%</h6>
      ) : null}
      <hr />
      <h6>
        Subtotal
        <span className="float-right">${getCartSubtotal().toFixed(2)}</span>
      </h6>
      {coupon && coupon.discount ? (
        <h6>
          Discount
          <span className="float-right">- ${getTotalSaved().toFixed(2)}</span>
        </h6>
      ) : null}
      <h6>
        Tax
        <span className="float-right">${getTax().toFixed(2)}</span>
      </h6>
      <hr />
      <h5>
        Total
        <span className="float-right">${getTotal().toFixed(2)}</span>
      </h5>
      <hr />
      {history.location.pathname !== '/checkout' ? (
        user ? (
          <Link to="/checkout">
            <Button
              type="primary"
              className="my-3"
              block
              shape="round"
              icon={<ShoppingOutlined />}
              size="large"
              onClick={handleDrawerToggle}
              disabled={!cart.length}
            >
              Checkout
            </Button>
          </Link>
        ) : (
          <Link to={{ pathname: '/login', state: { from: '/checkout' } }}>
            <Button
              type="primary"
              className="my-3"
              block
              shape="round"
              icon={<ShoppingOutlined />}
              size="large"
              onClick={handleDrawerToggle}
              disabled={!cart.length}
            >
              Login to Checkout
            </Button>
          </Link>
        )
      ) : null}
    </>
  );
};

export default OrderSummaryDisplay;
