import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { updateProduct, getProduct } from '../../../api/product';
import {
  getAllCategories,
  getCategorySubcategories
} from '../../../api/category';

import ProductForm from '../../../components/forms/ProductForm';
import FileUpload from '../../../components/forms/FileUpload';

const UpdateProduct = ({
  history,
  match: {
    params: { slug }
  }
}) => {
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

    getProduct(slug)
      .then((product) => {
        if (product.data) {
          const {
            title,
            description,
            price,
            category,
            subcategories,
            quantity,
            images,
            shipping
          } = product.data;

          getCategorySubcategories(category._id)
            .then((subcategories) => {
              if (!unmounted.current) {
                setSubcats(subcategories.data);
              }
            })
            .catch((error) => {
              toast.error(error.message);
            });

          let productSubcategories = [];
          subcategories.forEach((subcategory) => {
            productSubcategories.push(subcategory._id);
          });

          if (!unmounted.current) {
            setProduct({
              title,
              description,
              price,
              category: category._id,
              subcategories: productSubcategories,
              quantity,
              images,
              shipping: shipping === true ? 1 : 0
            });
          }
        } else {
          toast.error('Could not find product.');

          history.push('/admin/products');
        }
      })
      .catch((error) => {
        toast.error(error.message);
      });
  }, [slug, history]);

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

    updateProduct(slug, product, token)
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

        toast.success(`${res.data.title} product has been updated.`);

        history.push('/admin/products');
      })
      .catch((error) => {
        toast.error(error.response.data);
      });
  };

  return (
    <div className="container mt-4">
      <h3 className="text-primary">Update Product</h3>
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

export default UpdateProduct;
