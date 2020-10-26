import React, { useState, useEffect } from 'react';
import {
  getProductsInCategory,
  getProductsInSubcategory
} from '../../api/product';
import { toast } from 'react-toastify';

import ProductCard from '../../components/cards/ProductCard';
import LoadingCard from '../../components/cards/LoadingCard';

const Category = ({
  match: {
    params: { slug, categoryType }
  }
}) => {
  const [categoryName, setCategoryName] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    categoryType &&
      categoryType === 'category' &&
      getProductsInCategory(slug)
        .then((res) => {
          setCategoryName(res.data.category.name);
          setProducts(res.data.products);
          setLoading(false);
        })
        .catch((error) => {
          toast.error(error);
          setLoading(false);
        });

    categoryType &&
      categoryType === 'subcategory' &&
      getProductsInSubcategory(slug)
        .then((res) => {
          setCategoryName(res.data.subcategory.name);
          setProducts(res.data.products);
          setLoading(false);
        })
        .catch((error) => {
          toast.error(error);
          setLoading(false);
        });
  }, [slug, categoryType]);

  return (
    <div className="mb-5">
      <h4 className="text-center p-3 mb-5 display-4 jumbotron">
        {products && products.length}{' '}
        {products.length === 1 ? 'product' : 'products'} found in '
        {categoryName && categoryName}'
      </h4>
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
    </div>
  );
};

export default Category;
