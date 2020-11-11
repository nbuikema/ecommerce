import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import {
  getAllCategories,
  getCategorySubcategories
} from '../../../api/category';
import { createProduct } from '../../../api/product';

import ProductForm from '../../../components/forms/ProductForm';
import FileUpload from '../../../components/forms/FileUpload';

const CreateProduct = () => {
  const [product, setProduct] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    subcategories: [],
    quantity: '',
    images: [],
    shipping: 0
  });
  const [categories, setCategories] = useState([]);
  const [subcats, setSubcats] = useState([]);

  const {
    user: { token }
  } = useSelector((state) => ({ ...state }));

  const unmounted = useRef(false);

  useEffect(() => {
    return () => {
      unmounted.current = true;
    };
  }, []);

  const loadCategories = () => {
    getAllCategories()
      .then((categories) => {
        if (!unmounted.current) {
          setCategories(categories.data);
        }
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleChange = (e) => {
    if (e.target.name === 'category') {
      if (e.target.value === '-1') {
        setSubcats([]);
        setProduct({ ...product, category: '', subcategories: [] });
      } else {
        if (product.subcategories.length > 0) {
          setProduct({
            ...product,
            category: e.target.value,
            subcategories: []
          });
        } else {
          setProduct({
            ...product,
            category: e.target.value
          });
        }

        getCategorySubcategories(e.target.value)
          .then((subcategories) => {
            if (!unmounted.current) {
              setSubcats(subcategories.data);
            }
          })
          .catch((error) => {
            toast.error(error.message);
          });
      }
    } else {
      setProduct({ ...product, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    createProduct(product, token)
      .then((res) => {
        if (!unmounted.current) {
          setProduct({
            title: '',
            description: '',
            price: '',
            category: '',
            subcategories: [],
            quantity: '',
            images: [],
            shipping: 0
          });
        }

        toast.success(`${res.data.title} product has been created.`);
      })
      .catch((error) => {
        toast.error(error.response.data.error);
      });
  };

  return (
    <div className="container mt-4">
      <h3 className="text-primary">Create Product</h3>
      <FileUpload product={product} setProduct={setProduct} />
      <ProductForm
        product={product}
        setProduct={setProduct}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        categories={categories}
        subcats={subcats}
      />
    </div>
  );
};

export default CreateProduct;
