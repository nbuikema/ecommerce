import React, { useState, useEffect, useRef } from 'react';
import { getProductsByCount, deleteProduct } from '../../../api/product';
import { remove } from '../../../api/cloudinary';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';

import ProductCard from '../../../components/cards/ProductCard';

const Products = () => {
  const [products, setProducts] = useState([]);

  const {
    user: { token }
  } = useSelector((state) => ({ ...state }));

  const unmounted = useRef(false);

  useEffect(() => {
    return () => {
      unmounted.current = true;
    };
  }, []);

  useEffect(() => {
    getProductsByCount(10)
      .then((res) => {
        if (!unmounted.current) {
          setProducts(res.data);
        }
      })
      .catch((error) => {
        toast.error(error.message);
      });
  }, []);

  const handleDelete = (title, images, slug) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `You will not be able to recover the ${title} product!`,
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it.'
    }).then((result) => {
      if (result.value) {
        deleteProduct(slug, token)
          .then((res) => {
            images.forEach((image) => {
              remove(image.public_id, token)
                .then(() => {})
                .catch((error) => {
                  toast.error(error.message);
                });
            });

            toast.success(`${res.data.title} product has been removed.`);

            getProductsByCount(10)
              .then((res) => {
                if (!unmounted.current) {
                  setProducts(res.data);
                }
              })
              .catch((error) => {
                toast.error(error.message);
              });
          })
          .catch((error) => {
            toast.error(error.response.data);
          });
      }
    });
  };

  return (
    <div className="container mt-4">
      <h3 className="text-primary">Products</h3>
      <div className="row">
        {products.map((product) => (
          <div className="col-md-4 pb-3 d-flex" key={product._id}>
            <ProductCard
              product={product}
              handleDelete={handleDelete}
              showAdmin={true}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
