import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';

import { Card, Badge } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
const { Meta } = Card;
const { Ribbon } = Badge;

const ProductCard = ({ product, handleDelete }) => {
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

  const card = () => (
    <Card
      hoverable
      cover={
        <img
          alt={title}
          src={images && images.length > 0 ? images[0].url : ''}
          style={{ height: '150px', objectFit: 'cover' }}
          className="p-1"
        />
      }
      actions={[
        <Link to={`/admin/product/${slug}`}>
          <EditOutlined className="text-warning" />
        </Link>,
        <DeleteOutlined
          onClick={() => handleDelete(title, images, slug)}
          className="text-danger"
        />
      ]}
    >
      <Meta
        title={`${title} - $${price}`}
        description={`${description && description.substring(0, 100)}${
          description.length > 100 && '...'
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
