import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { useDispatch } from 'react-redux';

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
    updatedAt,
    createdAt
  } = product;

  const dispatch = useDispatch();

  const anHourAgo = moment(Date.now() - 60 * 60 * 1000).toDate();

  const handleAddToCart = () => {
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

    numProduct > 0 &&
      dispatch({
        type: 'CHANGE_QUANTITY',
        payload: {
          product,
          quantity: numProduct
        }
      });
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
        <div onClick={handleAddToCart} style={{ cursor: 'pointer' }}>
          <ShoppingCartOutlined className="text-success" />
          <br />
          Add To Cart
        </div>
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
  } else if (moment(updatedAt).toDate() > anHourAgo) {
    return (
      <Ribbon text="Just Updated!" color="orange">
        {card()}
      </Ribbon>
    );
  } else {
    return <>{card()}</>;
  }
};

export default ProductCard;
