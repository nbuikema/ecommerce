import React from 'react';
import { useHistory, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateCart, addToWishlist, removeFromWishlist } from '../../api/user';
import { toast } from 'react-toastify';

import AverageRatingDisplay from '../displays/AverageRatingDisplay';

import { Card, InputNumber } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  ShoppingCartOutlined,
  CloseOutlined,
  HeartFilled,
  HeartOutlined,
  CheckOutlined
} from '@ant-design/icons';
const { Meta } = Card;

const ProductCard = ({
  product,
  handleDelete,
  showAdmin = false,
  showCustomer = false,
  showCart = false,
  quantity
}) => {
  const {
    _id,
    title,
    slug,
    description,
    images,
    price,
    quantity: productQuantity
  } = product;

  const {
    cart: { cart },
    user
  } = useSelector((state) => ({ ...state }));

  const dispatch = useDispatch();

  const history = useHistory();

  const handleAddToCart = (e) => {
    e.stopPropagation();

    dispatch({
      type: 'ADD_TO_CART',
      payload: { product, quantity: 1 }
    });

    dispatch({
      type: 'SHOW_CART',
      payload: true
    });

    user &&
      updateCart(cart, { product, quantity: 1 }, user.token)
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

  const handleRemove = (e) => {
    e.stopPropagation();

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
          toast.error(error.message);
        });
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

  const handleWishlist = (e) => {
    e.stopPropagation();

    if (user && user.token) {
      user.wishlist.find((p) => p._id === _id)
        ? removeFromWishlist(user.token, _id)
            .then(async (res) => {
              const updateUser = await { ...res.data, token: user.token };

              dispatch({
                type: 'UPDATE_USER',
                payload: updateUser
              });

              toast.success(`${title} has been removed from your wishlist!`);
            })
            .catch((error) => {
              toast.error(error.message);
            })
        : addToWishlist(user.token, _id)
            .then(async (res) => {
              const updateUser = await { ...res.data, token: user.token };

              dispatch({
                type: 'UPDATE_USER',
                payload: updateUser
              });

              toast.success(`${title} has been added to your wishlist!`);
            })
            .catch((error) => {
              toast.error(error.message);
            });
    } else {
      history.push({
        pathname: '/login',
        state: { from: history.location.pathname }
      });
    }
  };

  const showActions = () => {
    if (showAdmin) {
      return [
        <Link to={`/admin/product/${slug}`}>
          <EditOutlined className="text-warning" />
          <br />
          Edit
        </Link>,
        <>
          <DeleteOutlined
            onClick={() => handleDelete(title, images, slug)}
            className="text-danger"
          />
          <br />
          Delete
        </>
      ];
    }
    if (showCustomer) {
      return [
        <>
          {cart.find((cartItem) => cartItem.product._id === _id) ? (
            <div onClick={handleRemove} style={{ cursor: 'pointer' }}>
              <CheckOutlined className="text-success" />
              <br />
              Added
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={productQuantity < 1}
              className="w-100 h-100 m-0 p-0"
              style={{
                cursor: 'pointer',
                border: 'none',
                backgroundColor: 'inherit'
              }}
            >
              <ShoppingCartOutlined
                className={productQuantity < 1 ? 'text-danger' : 'text-success'}
              />
              <br />
              {productQuantity < 1 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          )}
        </>,
        <div onClick={handleWishlist} style={{ cursor: 'pointer' }}>
          {user && user.token && user.wishlist.find((p) => p._id === _id) ? (
            <HeartFilled className="text-info" />
          ) : (
            <HeartOutlined className="text-info" />
          )}
          <br />
          {user && user.token
            ? user.wishlist.find((p) => p._id === _id)
              ? 'Remove from Wishlist'
              : 'Add to Wishlist'
            : 'Login for Wishlist'}
        </div>
      ];
    }
    if (showCart) {
      return [
        <div onClick={(e) => e.stopPropagation()}>
          <span onClick={(e) => e.stopPropagation()}>
            <InputNumber
              min={1}
              max={product.quantity}
              value={quantity}
              onChange={(value) => handleQuantityChange(value, product)}
            />
            <br />
            Quantity
          </span>
        </div>,
        <div onClick={handleRemove}>
          <CloseOutlined
            className="text-danger mt-2"
            style={{ fontSize: '20px' }}
          />
          <br />
          Remove
        </div>
      ];
    }
  };

  return (
    <div
      className="d-flex w-100"
      onClick={() => {
        history.push(`/product/${slug}`);

        dispatch({
          type: 'SHOW_CART',
          payload: false
        });
      }}
    >
      <Card
        hoverable
        cover={
          <>
            {!showCart && (
              <div className="mt-3 mb-1">
                <AverageRatingDisplay product={product} />
              </div>
            )}
            <img
              alt={title}
              src={images && images.length > 0 ? images[0].url : ''}
              style={{ height: '180px', objectFit: 'cover' }}
              className="p-1"
            />
          </>
        }
        actions={showActions()}
        className="d-flex flex-column w-100"
      >
        <Meta
          title={`${title} - $${price}`}
          description={`${
            !showCart ? description && description.substring(0, 100) : ''
          }${!showCart && description.length > 100 ? '...' : ''}`}
        />
      </Card>
    </div>
  );
};

export default ProductCard;
