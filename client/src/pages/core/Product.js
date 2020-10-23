import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { getProduct, rateProduct, getRelatedProducts } from '../../api/product';
import { useSelector } from 'react-redux';

import ProductDisplay from '../../components/displays/ProductDisplay';
import ProductCard from '../../components/cards/ProductCard';

const Product = ({
  match: {
    params: { slug }
  },
  history
}) => {
  const [product, setProduct] = useState({});
  const [rating, setRating] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const { user } = useSelector((state) => ({ ...state }));

  const memoizedLoadProduct = useCallback(() => {
    getProduct(slug)
      .then((product) => {
        setProduct(product.data);

        const { ratings } = product.data;
        if (ratings && user) {
          const existingRating = ratings.find((rating) => {
            return rating.postedBy.toString() === user._id.toString();
          });

          existingRating && setRating(existingRating.rating);
        }

        getRelatedProducts(product.data._id)
          .then((res) => {
            setRelatedProducts(res.data);
          })
          .catch((error) => {
            toast.error(error);
          });
      })
      .catch((error) => {
        toast.error('Could not find product.');

        history.push('/');
      });
  }, [history, slug, user]);

  useEffect(() => {
    memoizedLoadProduct();
  }, [memoizedLoadProduct]);

  const handleChangeRating = (newRating) => {
    setRating(newRating);
  };

  const handleSubmitRating = (name) => {
    rateProduct(name, rating, user.token)
      .then((res) => {
        memoizedLoadProduct();
        setRating(0);
        if (res.data.nModified === 1) {
          toast.success('Your Review Has Been Updated.');
        } else {
          toast.success('Thanks For Your Review!');
        }
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  return (
    <div className="container">
      <div className="row py-3">
        <ProductDisplay
          product={product}
          handleChangeRating={handleChangeRating}
          handleSubmitRating={handleSubmitRating}
          rating={rating}
        />
      </div>
      <hr />
      <div className="row py-3">
        <div className="col text-center">
          <h4>Related Products</h4>
          <div className="row mt-5">
            {relatedProducts.map((product) => (
              <div className="col-md-4 pb-3 d-flex" key={product._id}>
                <ProductCard product={product} showCustomer={true} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
