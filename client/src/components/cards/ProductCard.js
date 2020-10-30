import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { updateCart } from '../../api/user';

import AverageRatingDisplay from '../displays/AverageRatingDisplay';

import { Card, Badge, InputNumber } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  ShoppingCartOutlined,
  CloseOutlined
} from '@ant-design/icons';
const { Meta } = Card;
const { Ribbon } = Badge;

const ProductCard = ({
  product,
  handleDelete,
  showAdmin = false,
  showCustomer = false,
  showCart = false,
  quantity
}) => {
  const {
    title,
    slug,
    description,
    images,
    price,
    createdAt,
    quantity: productQuantity
  } = product;

  const { cart, user } = useSelector((state) => ({ ...state }));

  const dispatch = useDispatch();

  const anHourAgo = moment(Date.now() - 60 * 60 * 1000).toDate();

  const handleAddToCart = () => {
    user &&
      updateCart(cart, { product, quantity: 1 }, user.token)
        .then(() => {})
        .catch((error) => {
          console.log(error);
        });

    dispatch({
      type: 'ADD_TO_CART',
      payload: { product, quantity: 1 }
    });

    dispatch({
      type: 'TOGGLE_SHOW',
      payload: true
    });
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

  const handleQuantityChange = (quantityValue, product) => {
    const value = parseInt(quantityValue);

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
        <a
          onClick={handleAddToCart}
          style={{ cursor: 'pointer' }}
          disabled={productQuantity < 1}
        >
          <ShoppingCartOutlined
            className={productQuantity < 1 ? 'text-danger' : 'text-success'}
          />
          <br />
          {productQuantity < 1 ? 'Out of Stock' : 'Add to Cart'}
        </a>
      ];
    }
    if (showCart) {
      return [
        <div>
          <InputNumber
            min={1}
            max={product.quantity}
            value={quantity}
            onChange={(value) => handleQuantityChange(value, product)}
          />
          <br />
          Quantity
        </div>,
        <div onClick={() => handleRemove(product)}>
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

  const card = () => (
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
  );

  if (moment(createdAt).toDate() > anHourAgo) {
    return <Ribbon text="New Product!">{card()}</Ribbon>;
  } else {
    return <>{card()}</>;
  }
};

export default ProductCard;
