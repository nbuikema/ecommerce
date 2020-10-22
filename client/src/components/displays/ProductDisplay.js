import React from 'react';
import { Link } from 'react-router-dom';

import { Card, Tabs } from 'antd';
import {
  HeartOutlined,
  ShoppingCartOutlined,
  StarOutlined
} from '@ant-design/icons';
const { TabPane } = Tabs;

const ProductDisplay = ({ product }) => {
  const {
    title,
    description,
    images,
    price,
    category,
    subcategories,
    shipping,
    quantity
  } = product;

  const showImages = () => (
    <div
      id="carouselExampleIndicators"
      className="carousel slide"
      data-ride="carousel"
    >
      <div className="carousel-inner">
        {images &&
          images.length > 0 &&
          images.map((image, i) => (
            <div
              key={i}
              className={`carousel-item h-100 ${i === 0 ? 'active' : ''}`}
            >
              <img
                src={image.url}
                className="d-block w-100 h-100"
                alt={image.url}
              />
            </div>
          ))}
        <a
          className="carousel-control-prev"
          href="#carouselExampleIndicators"
          role="button"
          data-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="sr-only">Previous</span>
        </a>
        <a
          className="carousel-control-next"
          href="#carouselExampleIndicators"
          role="button"
          data-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="sr-only">Next</span>
        </a>
      </div>
      <ol className="carousel-indicators row mt-4">
        {images &&
          images.length > 0 &&
          images.map((image, i) => (
            <li
              className={`col px-0 mb-0 ${i === 0 ? 'active' : ''}`}
              key={i}
              data-target="#carouselExampleIndicators"
              data-slide-to={i}
            >
              <img src={image.url} className="d-block h-100" alt={image.url} />
            </li>
          ))}
      </ol>
    </div>
  );

  return (
    <>
      <div className="col-md-7">{showImages()}</div>
      <div className="col-md-5">
        <h1 className="bg-info rounded p-3">{title}</h1>
        <Card
          actions={[
            <>
              <ShoppingCartOutlined className="text-success" />
              <br />
              Add To Cart
            </>,
            <>
              <HeartOutlined className="text-info" />
              <br />
              Add To Wishlist
            </>,
            <>
              <StarOutlined className="text-danger" />
              <br />
              Leave Rating
            </>
          ]}
        >
          <ul className="list-group mb-4">
            <li className="list-group-item">
              Price
              <span className="label label-default label-pill pull-xs-right">
                ${price && price}
              </span>
            </li>
            <li className="list-group-item">
              Category
              <Link
                to={`/category/${category && category.slug}`}
                className="label label-default label-pill pull-xs-right"
              >
                {category && category.name}
              </Link>
            </li>
            <li className="list-group-item">
              Subcategories
              {subcategories &&
                subcategories.map((subcategory) => (
                  <Link
                    key={subcategory._id}
                    to={`/subcategory/${subcategory.slug}`}
                    className="label label-default label-pill pull-xs-right"
                  >
                    {subcategory.name}
                  </Link>
                ))}
            </li>
            <li className="list-group-item">
              Shipping
              <span className="label label-default label-pill pull-xs-right">
                {shipping && shipping === true ? 'Yes' : 'No'}
              </span>
            </li>
            <li className="list-group-item">
              Available
              <span className="label label-default label-pill pull-xs-right">
                {quantity && quantity}
              </span>
            </li>
          </ul>
          <Tabs type="card">
            <TabPane tab="Description" key={1}>
              {description && description}
            </TabPane>
            <TabPane tab="More Info" key={2}></TabPane>
          </Tabs>
        </Card>
      </div>
    </>
  );
};

export default ProductDisplay;
