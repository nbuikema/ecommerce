import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import StarRatings from 'react-star-ratings';
import { useDispatch, useSelector } from 'react-redux';
import {
  addToWishlist,
  updateCart,
  removeFromWishlist
} from '../../../api/user';
import { toast } from 'react-toastify';

import RatingModal from '../../../components/modals/RatingModal';
import AverageRatingDisplay from '../AverageRatingDisplay';

import { Card, Tabs } from 'antd';
import {
  HeartOutlined,
  HeartFilled,
  ShoppingCartOutlined,
  CheckOutlined
} from '@ant-design/icons';

import './ProductDisplay.css';

const { TabPane } = Tabs;

const ProductDisplay = ({
  product,
  handleChangeRating,
  handleSubmitRating,
  rating
}) => {
  const {
    _id,
    title,
    description,
    images,
    price,
    category,
    subcategories,
    shipping,
    quantity
  } = product;

  const {
    cart: { cart },
    user
  } = useSelector((state) => ({ ...state }));

  const dispatch = useDispatch();

  const history = useHistory();

  const handleAddToCart = () => {
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

  const handleWishlist = () => {
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
        state: { from: `/product/${product.slug}` }
      });
    }
  };

  const handleRemove = () => {
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

  const showImages = () => (
    <div
      id="carouselExampleIndicators"
      className="carousel slide align-self-center w-100"
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
              className={`col px-0 mb-3 mx-2 ${i === 0 ? 'active' : ''}`}
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
      <div className="d-block d-lg-none w-100 mb-4">
        <h1 className="text-primary rounded text-center mb-3">{title}</h1>
        <AverageRatingDisplay product={product} />
        <Card
          className="hide-body mt-3 mx-3"
          actions={[
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
                  disabled={quantity < 1}
                  className="w-100 h-100 m-0 p-0"
                  style={{
                    cursor: 'pointer',
                    border: 'none',
                    backgroundColor: 'inherit'
                  }}
                >
                  <ShoppingCartOutlined
                    className={quantity < 1 ? 'text-danger' : 'text-success'}
                  />
                  <br />
                  {quantity < 1 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              )}
            </>,
            <div onClick={handleWishlist} style={{ cursor: 'pointer' }}>
              {user &&
              user.token &&
              user.wishlist.find((p) => p._id === _id) ? (
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
            </div>,
            <RatingModal
              handleSubmitRating={handleSubmitRating}
              product={_id}
              rating={rating}
            >
              <StarRatings
                name={_id}
                numberOfStars={5}
                starRatedColor="red"
                rating={rating}
                changeRating={handleChangeRating}
              />
            </RatingModal>
          ]}
        ></Card>
      </div>
      <div className="col-lg-7 d-flex w-100">{showImages()}</div>
      <div className="col-lg-5">
        <div className="d-none d-lg-block w-100">
          <h1 className="text-primary rounded text-center">{title}</h1>
          <AverageRatingDisplay product={product} />
        </div>
        <Card
          className="mt-3"
          actions={[
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
                  disabled={quantity < 1}
                  className="w-100 h-100 m-0 p-0"
                  style={{
                    cursor: 'pointer',
                    border: 'none',
                    backgroundColor: 'inherit'
                  }}
                >
                  <ShoppingCartOutlined
                    className={quantity < 1 ? 'text-danger' : 'text-success'}
                  />
                  <br />
                  {quantity < 1 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              )}
            </>,
            <div onClick={handleWishlist} style={{ cursor: 'pointer' }}>
              {user &&
              user.token &&
              user.wishlist.find((p) => p._id === _id) ? (
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
            </div>,
            <RatingModal
              handleSubmitRating={handleSubmitRating}
              product={_id}
              rating={rating}
            >
              <StarRatings
                name={_id}
                numberOfStars={5}
                starRatedColor="red"
                rating={rating}
                changeRating={handleChangeRating}
              />
            </RatingModal>
          ]}
        >
          <ul className="list-group mb-4 text-primary">
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
          <Tabs type="card" className="text-primary">
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
