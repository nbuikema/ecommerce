import React, { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'react-toastify';
import { getProduct, rateProduct, getRelatedProducts } from '../../api/product';
import { useSelector } from 'react-redux';

import ProductDisplay from '../../components/displays/ProductDisplay/ProductDisplay';
import ProductCard from '../../components/cards/ProductCard';
import LoadingProductDisplay from '../../components/displays/LoadingProductDisplay';
import LoadingCard from '../../components/cards/LoadingCard';

const Product = ({
  match: {
    params: { slug }
  },
  history
}) => {
  const [product, setProduct] = useState({});
  const [rating, setRating] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [loadingRelated, setLoadingRelated] = useState(false);

  const { user } = useSelector((state) => ({ ...state }));

  const unmounted = useRef(false);

  useEffect(() => {
    return () => {
      unmounted.current = true;
    };
  }, []);

  const memoizedLoadProduct = useCallback(() => {
    setLoadingProduct(true);
    setLoadingRelated(true);

    getProduct(slug)
      .then((product) => {
        if (!unmounted.current) {
          if (!product.data) {
            return history.push('/shop');
          }

          setProduct(product.data);
          setLoadingProduct(false);

          const { ratings } = product.data;
          if (ratings && user) {
            const existingRating = ratings.find((rating) => {
              return rating.postedBy.toString() === user._id.toString();
            });

            existingRating && setRating(existingRating.rating);
          }

          getRelatedProducts(product.data._id)
            .then((res) => {
              if (!unmounted.current) {
                setRelatedProducts(res.data);
                setLoadingRelated(false);
              }
            })
            .catch((error) => {
              if (!unmounted.current) {
                toast.error(error.message);

                setLoadingRelated(false);
              }
            });
        }
      })
      .catch((error) => {
        if (!unmounted.current) {
          setLoadingProduct(false);

          toast.error(error.message);

          history.push('/shop');
        }
      });

    // eslint-disable-next-line
  }, [user]);

  useEffect(() => {
    memoizedLoadProduct();
  }, [memoizedLoadProduct]);

  const handleChangeRating = (newRating) => {
    setRating(newRating);
  };

  const handleSubmitRating = (name) => {
    rateProduct(name, rating, user.token)
      .then((res) => {
        if (!unmounted.current) {
          memoizedLoadProduct();
          setRating(0);
          if (res.data.nModified === 1) {
            toast.success('Your Review Has Been Updated.');
          } else {
            toast.success('Thanks For Your Review!');
          }
        }
      })
      .catch((error) => {
        if (!unmounted.current) {
          toast.error(error.message);
        }
      });
  };

  return (
    <div className="container bg-primary mt-4">
      <div className="row py-4">
        {loadingProduct ? (
          <LoadingProductDisplay />
        ) : (
          <ProductDisplay
            product={product}
            handleChangeRating={handleChangeRating}
            handleSubmitRating={handleSubmitRating}
            rating={rating}
          />
        )}
      </div>
      <hr />
      <div className="row py-3">
        <div className="col text-center">
          <h4>Related Products</h4>
          <div className="row mt-5">
            {loadingRelated ? (
              <>
                <div className="col-lg-4 pb-3 mx-md-5 mx-lg-0 px-md-5 px-lg-3">
                  <LoadingCard />
                </div>
                <div className="col-lg-4 pb-3 mx-md-5 mx-lg-0 px-md-5 px-lg-3">
                  <LoadingCard />
                </div>
                <div className="col-lg-4 pb-3 mx-md-5 mx-lg-0 px-md-5 px-lg-3">
                  <LoadingCard />
                </div>
              </>
            ) : (
              relatedProducts.map((product) => (
                <div
                  className="col-lg-4 pb-3 d-flex mx-md-5 mx-lg-0 px-md-5 px-lg-3"
                  key={product._id}
                >
                  <ProductCard product={product} showCustomer={true} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
