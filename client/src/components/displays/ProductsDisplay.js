import React, { useState, useEffect } from 'react';
import { getProductsWithQuery, getProductsCount } from '../../api/product';
import { toast } from 'react-toastify';

import ProductCard from '../../components/cards/ProductCard';
import LoadingCard from '../../components/cards/LoadingCard';

import { Pagination } from 'antd';

const ProductsDisplay = ({ name, sort, order, limit }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [productsCount, setProductsCount] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    getProductsCount()
      .then((res) => {
        setProductsCount(res.data);
        getProductsWithQuery(sort, order, limit, page)
          .then((res) => {
            if (res.data[0].averageRating) {
              let productsArray = [];

              for (let i = 0; i < res.data.length; i++) {
                productsArray.push({
                  ...res.data[i].document,
                  averageRating: res.data[i].averageRating
                });
              }
              setProducts(productsArray);
              setLoading(false);
            } else {
              setProducts(res.data);
              setLoading(false);
            }
          })
          .catch((error) => {
            toast.error(error);
            setLoading(false);
          });
      })
      .catch((error) => {
        toast.error(error);
        setLoading(false);
      });
  }, [sort, order, limit, page]);

  return (
    <div className="mb-5">
      <h4 className="text-center p-3 mb-5 display-4 jumbotron">{name}</h4>
      <div className="container">
        <div className="row">
          {loading ? (
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
        <nav className="col-md-4 offset-md-4 text-center pt-5 p-3">
          <Pagination
            current={page}
            total={(productsCount / limit) * 10}
            onChange={(value) => setPage(value)}
            className="text-center"
          />
        </nav>
      </div>
    </div>
  );
};

export default ProductsDisplay;
