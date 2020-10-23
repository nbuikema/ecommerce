import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';

import AverageRatingDisplay from '../displays/AverageRatingDisplay';

import { Card, Badge } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ShoppingCartOutlined
} from '@ant-design/icons';
const { Meta } = Card;
const { Ribbon } = Badge;

const ProductCard = ({
  product,
  handleDelete,
  showAdmin = false,
  showCustomer = false
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

  const anHourAgo = moment(Date.now() - 60 * 60 * 1000).toDate();

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
    } else if (showCustomer) {
      return [
        <Link to={`/product/${slug}`}>
          <EyeOutlined className="text-info" />
          <br />
          View Product
        </Link>,
        <>
          <ShoppingCartOutlined className="text-success" />
          <br />
          Add To Cart
        </>
      ];
    }
  };

  const card = () => (
    <Card
      hoverable
      cover={
        <>
          <div className="mt-3 mb-1">
            <AverageRatingDisplay product={product} />
          </div>
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
        description={`${description && description.substring(0, 100)}${
          description.length > 100 ? '...' : ''
        }`}
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
