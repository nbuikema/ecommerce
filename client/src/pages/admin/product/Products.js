import React, { useState, useEffect } from 'react';
import { getProductsByCount, deleteProduct } from '../../../api/product';
import { remove } from '../../../api/cloudinary';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';

import AdminNav from '../../../components/nav/AdminNav';
import ProductCard from '../../../components/cards/ProductCard';

const Products = () => {
  const [products, setProducts] = useState([]);

  const {
    user: { token }
  } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    getProductsByCount(10)
      .then((res) => {
        setProducts(res.data);
      })
      .catch((error) => {
        toast.error(error);
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
                  toast.error(error);
                });
            });

            toast.success(`${res.data.title} product has been removed.`);

            getProductsByCount(10)
              .then((res) => {
                setProducts(res.data);
              })
              .catch((error) => {
                toast.error(error);
              });
          })
          .catch((error) => {
            toast.error(error.response.data);
          });
      }
    });
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col">
          <h4>Products</h4>
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
      </div>
    </div>
  );
};

export default Products;
