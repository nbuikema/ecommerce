import React from 'react';

import ProductCard from '../../components/cards/ProductCard';
import LoadingCard from '../../components/cards/LoadingCard';
import LoadingForm from '../../components/forms/LoadingForm';

import { Pagination } from 'antd';

const ShopDisplay = ({
  productsCount,
  products,
  loadingProducts,
  loadingProductsCount,
  page,
  setPage,
  limit
}) => {
  return (
    <div>
      <div className="row mx-sm-5 mx-md-0 px-3 px-md-0">
        {loadingProducts ? (
          <>
            <div className="col-md-6 col-xl-4 pb-3 px-2">
              <LoadingCard showCustomer={true} />
            </div>
            <div className="col-md-6 col-xl-4 pb-3 px-2">
              <LoadingCard showCustomer={true} />
            </div>
            <div className="col-md-6 col-xl-4 pb-3 px-2">
              <LoadingCard showCustomer={true} />
            </div>
            <div className="col-md-6 col-xl-4 pb-3 px-2">
              <LoadingCard showCustomer={true} />
            </div>
            <div className="col-md-6 col-xl-4 pb-3 px-2">
              <LoadingCard showCustomer={true} />
            </div>
            <div className="col-md-6 col-xl-4 pb-3 px-2">
              <LoadingCard showCustomer={true} />
            </div>
          </>
        ) : (
          <>
            {products.map((product) => (
              <div
                className="col-md-6 col-xl-4 pb-3 d-flex px-2"
                key={product._id}
              >
                <ProductCard product={product} showCustomer={true} />
              </div>
            ))}
          </>
        )}
      </div>
      <div className="row">
        {loadingProductsCount ? (
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
              hideOnSinglePage
              className="text-center"
              disabled={loadingProducts}
              showTotal={(total, range) =>
                `Showing ${range[0]}-${range[1]} of ${total} Items`
              }
            />
          </nav>
        )}
      </div>
    </div>
  );
};

export default ShopDisplay;
