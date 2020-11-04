import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    setLoadingCount(true);

    getProductsCount()
      .then((res) => {
        setProductsCount(res.data);
        setLoadingCount(false);
      })
      .catch((error) => {
        toast.error(error.message);

        setLoadingCount(false);
      });
  }, []);

  useEffect(() => {
    setLoadingProducts(true);

    getProductsWithQuery(sort, order, limit, page)
      .then((res) => {
        setProducts(res.data);
        setLoadingProducts(false);
      })
      .catch((error) => {
        toast.error(error.message);

        setLoadingProducts(false);
      });
  }, [sort, order, limit, page]);

  return (
    <div className="mb-5">
      <h4 className="text-center p-3 mb-5 display-4 jumbotron">{name}</h4>
      <div className="container">
        <div className="row">
          {loadingCount ? (
            <>
              <div className="col-md-4 pb-3">
                <LoadingCard showCustomer={true} />
              </div>
              <div className="col-md-4 pb-3">
                <LoadingCard showCustomer={true} />
              </div>
              <div className="col-md-4 pb-3">
                <LoadingCard showCustomer={true} />
              </div>
            </>
          ) : (
            <>
              {products.map((product) => (
                <div className="col-md-4 pb-3 d-flex" key={product._id}>
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