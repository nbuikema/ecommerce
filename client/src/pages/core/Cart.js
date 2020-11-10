import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { updateCart } from '../../api/user';
import { toast } from 'react-toastify';

import ImageModal from '../../components/modals/ImageModal';
import ProductCard from '../../components/cards/ProductCard';
import OrderSummaryDisplay from '../../components/displays/OrderSummaryDisplay';

import { InputNumber } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

const Cart = () => {
  const {
    cart: { cart },
    user
  } = useSelector((state) => ({ ...state }));

  const dispatch = useDispatch();

  const handleQuantityChange = (quantityValue, product) => {
    const value = parseInt(quantityValue);

    const numProduct =
      value > 0 ? (value < product.quantity ? value : product.quantity) : 1;

    if (numProduct > 0) {
      dispatch({
        type: 'CHANGE_QUANTITY',
        payload: { product, quantity: numProduct }
      });

      user &&
        updateCart(cart, { product, quantity: numProduct }, user.token)
          .then((res) => {
            dispatch({
              type: 'GET_CART_FROM_DB',
              payload: res.data
            });
          })
          .catch((error) => {
            toast.error(error.response.data.error);
          });
    }
  };

  const handleRemove = (product) => {
    dispatch({
      type: 'REMOVE_FROM_CART',
      payload: product
    });

    user &&
      updateCart(cart, { product, quantity: 0 }, user.token)
        .then((res) => {
          dispatch({
            type: 'GET_CART_FROM_DB',
            payload: res.data
          });
        })
        .catch((error) => {
          toast.error(error.response.data.error);
        });
  };

  const handleDrawerToggle = () => {
    dispatch({
      type: 'SHOW_CART',
      payload: false
    });
  };

  const showCartLarge = () => {
    return cart && cart.length > 0 ? (
      <table className="table table-bordered text-primary table-hover">
        <thead>
          <tr>
            <th scope="col" className="text-primary bg-white">
              Image
            </th>
            <th scope="col" className="text-primary bg-white">
              Title
            </th>
            <th scope="col" className="text-primary bg-white">
              Price
            </th>
            <th scope="col" className="text-primary bg-white">
              Quantity
            </th>
            <th scope="col" className="text-primary bg-white">
              Total Price
            </th>
            <th scope="col" className="text-primary bg-white">
              Remove
            </th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item, index) => (
            <tr key={index}>
              <td className="text-center">
                {item.product.images.length ? (
                  <ImageModal
                    title={item.product.title}
                    images={item.product.images}
                  />
                ) : (
                  ''
                )}
              </td>
              <td>{item.product.title}</td>
              <td>${item.product.price}</td>
              <td>
                <div>
                  <InputNumber
                    min={1}
                    max={item.product.quantity}
                    value={item.quantity}
                    onChange={(value) =>
                      handleQuantityChange(value, item.product)
                    }
                    onClick={(e) => e.preventDefault()}
                  />
                </div>
              </td>
              <td>
                $
                {(
                  Math.round(item.product.price * item.quantity * 100) / 100
                ).toFixed(2)}
              </td>
              <td className="text-center">
                <CloseOutlined
                  onClick={() => handleRemove(item.product)}
                  className="text-danger"
                  style={{ cursor: 'pointer', fontSize: '30px' }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <h5 className="text-primary text-center">
        Oops! Your cart is empty.
        <br />
        <Link to="/shop" onClick={handleDrawerToggle}>
          Continue Shopping
        </Link>
      </h5>
    );
  };

  const showCartSmall = () => {
    return cart && cart.length > 0 ? (
      <div className="row">
        {cart.map((item) => (
          <div
            className="pb-3 col-sm-12 col-md-6 px-sm-5 px-md-3"
            key={item.product._id}
          >
            <ProductCard
              product={item.product}
              showCart={true}
              quantity={item.quantity}
            />
          </div>
        ))}
      </div>
    ) : (
      <h5 className="text-primary text-center">
        Oops! Your cart is empty.
        <br />
        <Link to="/shop" onClick={handleDrawerToggle}>
          Continue Shopping
        </Link>
      </h5>
    );
  };

  return (
    <div className="container">
      <div className="row pt-4">
        <div className="col-lg-8">
          <h3 className="text-primary">My Cart</h3>
          <hr />
          <div className="d-none d-xl-block">{showCartLarge()}</div>
          <div className="d-block d-xl-none">{showCartSmall()}</div>
        </div>
        <div className="col-lg-4 ">
          <OrderSummaryDisplay />
        </div>
      </div>
    </div>
  );
};

export default Cart;
