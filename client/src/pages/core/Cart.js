import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { updateCart } from '../../api/user';
import { toast } from 'react-toastify';

import ImageModal from '../../components/modals/ImageModal';

import { InputNumber } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

const Cart = () => {
  const {
    cart: { cart },
    user
  } = useSelector((state) => ({ ...state }));

  const dispatch = useDispatch();

  const getTotal = () => {
    return parseFloat(
      cart
        .reduce((acc, item) => {
          return acc + item.quantity * item.product.price;
        }, 0)
        .toFixed(2)
    );
  };

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
            toast.error(error.message);
          });
    }
  };

  const handleRemove = (product) => {
    user &&
      updateCart(cart, { product, quantity: 0 }, user.token)
        .then(() => {})
        .catch((error) => {
          console.log(error);
        });

    dispatch({
      type: 'REMOVE_FROM_CART',
      payload: product
    });
  };

  const showCart = () => {
    return cart.length > 0 ? (
      <>
        <h4>My Cart</h4>
        <hr />
        <table className="table table-bordered">
          <thead className="thead-light">
            <tr>
              <th scope="col">Image</th>
              <th scope="col">Title</th>
              <th scope="col">Price</th>
              <th scope="col">Quantity</th>
              <th scope="col">Total Price</th>
              <th scope="col">Remove</th>
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
                  ${parseFloat((item.product.price * item.quantity).toFixed(2))}
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
      </>
    ) : (
      <p>
        No Products in Cart. <Link to="/shop">Continue Shopping</Link>
      </p>
    );
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-8">{showCart()}</div>
        <div className="col-md-4">
          <h4>Order Summary</h4>
          <hr />
          <h6>Products</h6>
          {cart.map((item, index) => (
            <div key={index}>
              <p>
                {item.product.title} x {item.quantity} = $
                {parseFloat(item.quantity * item.product.price).toFixed(2)}
              </p>
            </div>
          ))}
          <hr />
          <h6>Total: ${parseFloat(getTotal()).toFixed(2)}</h6>
          <hr />
          {user ? (
            <Link to="/checkout" className="btn btn-lg btn-primary mt-2 w-100">
              Checkout
            </Link>
          ) : (
            <button className="btn btn-lg btn-danger mt-2 w-100">
              <Link to={{ pathname: '/login', state: { from: 'cart' } }}>
                Login to Checkout
              </Link>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
