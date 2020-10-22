import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getProduct } from '../../api/product';

import ProductDisplay from '../../components/displays/ProductDisplay';

const Product = ({
  match: {
    params: { slug }
  },
  history
}) => {
  const [product, setProduct] = useState({});

  useEffect(() => {
    getProduct(slug)
      .then((product) => {
        setProduct(product.data);
      })
      .catch((error) => {
        toast.error('Could not find product.');

        history.push('/');
      });
  }, [slug, history]);

  return (
    <div className="container">
      <div className="row py-3">
        <ProductDisplay product={product} />
      </div>
      <hr />
      <div className="row py-3">
        <div className="col text-center">
          <h4>Related Products</h4>
        </div>
      </div>
    </div>
  );
};

export default Product;
