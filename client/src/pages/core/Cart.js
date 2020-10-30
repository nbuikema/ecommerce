import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { updateCart } from '../../api/user';

import ImageModal from '../../components/modals/ImageModal';

import { CloseOutlined } from '@ant-design/icons';

const Cart = () => {
  const { cart, user } = useSelector((state) => ({ ...state }));

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

  const handleQuantityChange = (product, e) => {
    const value = parseInt(e.target.value);

    let numProduct;
    numProduct =
      value > 0 ? (value < product.quantity ? value : product.quantity) : 1;

    if (numProduct > 0) {
      user &&
        updateCart(cart, { product, quantity: numProduct }, user.token)
          .then(() => {})
          .catch((error) => {
            console.log(error);
          });

      dispatch({
        type: 'CHANGE_QUANTITY',
        payload: {
          product,
          quantity: numProduct
        }
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
                <td style={{ width: '120px' }}>
                  <input
                    type="number"
                    className="form-control"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.product, e)}
                  />
                </td>
                <td>${item.product.price * item.quantity}</td>
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
