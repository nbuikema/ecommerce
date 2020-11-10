import React, { useState, useEffect, useRef } from 'react';
import { getProductsWithQuery, getProductsCount } from '../../api/product';
import { toast } from 'react-toastify';

import ProductCard from '../../components/cards/ProductCard';
import LoadingCard from '../../components/cards/LoadingCard';
import LoadingForm from '../../components/forms/LoadingForm';

import { Pagination } from 'antd';

const HomeDisplay = ({ name, sort, order, limit }) => {
  const [products, setProducts] = useState([]);
  const [productsCount, setProductsCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loadingCount, setLoadingCount] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const unmounted = useRef(false);

  useEffect(() => {
    return () => {
      unmounted.current = true;
    };
  }, []);

  useEffect(() => {
    setLoadingCount(true);

    getProductsCount()
      .then((res) => {
        if (!unmounted.current) {
          setProductsCount(res.data);
          setLoadingCount(false);
        }
      })
      .catch((error) => {
        if (!unmounted.current) {
          setLoadingCount(false);
        }

        toast.error(error.message);
      });
  }, []);

  useEffect(() => {
    setLoadingProducts(true);

    getProductsWithQuery(sort, order, limit, page)
      .then((res) => {
        if (!unmounted.current) {
          setProducts(res.data);
          setLoadingProducts(false);
        }
      })
      .catch((error) => {
        if (!unmounted.current) {
          setLoadingProducts(false);
        }

        toast.error(error.message);
      });
  }, [sort, order, limit, page]);

  return (
    <div className="pb-5 bg-primary">
      <h3 className="text-center p-3 mb-5 display-3 jumbotron text-primary">
        {name}
      </h3>
      <div className="container-fluid">
        <div className="row mx-sm-5 mx-md-0 mx-xl-5 px-3 px-lg-5">
          {loadingCount ? (
            <>
              <div className="col-md-4 pb-3 px-2 px-lg-4">
                <LoadingCard />
              </div>
              <div className="col-md-4 pb-3 px-2 px-lg-4">
                <LoadingCard />
              </div>
              <div className="col-md-4 pb-3 px-2 px-lg-4">
                <LoadingCard />
              </div>
            </>
          ) : (
            <>
              {products.map((product) => (
                <div
                  className="col-md-4 pb-3 d-flex px-2 px-lg-4"
                  key={product._id}
                >
                  <ProductCard product={product} showCustomer={true} />
                </div>
              ))}
            </>
          )}
        </div>
      </div>
      <div className="row">
        {loadingCount ? (
          <div className="col-md-4 offset-md-4 text-center pt-5 p-3">
            <LoadingForm />
          </div>
        ) : (
          <nav className="col-md-4 offset-md-4 text-center pt-5 p-3">
            <Pagination
              current={page}
              total={productsCount}
              pageSize={limit}
              showSizeChanger={false}
              hideOnSinglePage
              onChange={(value) => setPage(value)}
              className="text-center"
              disabled={loadingProducts}
            />
          </nav>
        )}
      </div>
    </div>
  );
};

export default HomeDisplay;
