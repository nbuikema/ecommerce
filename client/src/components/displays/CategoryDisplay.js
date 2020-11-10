import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getAllCategories } from '../../api/category';
import { getAllSubcategories } from '../../api/subcategory';
import { toast } from 'react-toastify';

import LoadingForm from '../../components/forms/LoadingForm';

const CategoryDisplay = ({ name }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const unmounted = useRef(false);

  useEffect(() => {
    return () => {
      unmounted.current = true;
    };
  }, []);

  useEffect(() => {
    setLoading(true);

    name === 'Categories' &&
      getAllCategories()
        .then((res) => {
          if (!unmounted.current) {
            setCategories(res.data);
            setLoading(false);
          }
        })
        .catch((error) => {
          if (!unmounted.current) {
            setLoading(false);
          }

          toast.error(error.message);
        });

    name === 'Subcategories' &&
      getAllSubcategories()
        .then((res) => {
          if (!unmounted.current) {
            setCategories(res.data);
            setLoading(false);
          }
        })
        .catch((error) => {
          if (!unmounted.current) {
            setLoading(false);
          }

          toast.error(error.message);
        });
  }, [name]);

  return (
    <div className="pb-5 bg-primary">
      <h3 className="text-center p-3 mb-5 display-3 jumbotron text-primary">
        {name}
      </h3>
      <div className="container-fluid">
        <div className="row mx-sm-5">
          {loading ? (
            <div className="m-3 col">
              <LoadingForm />
            </div>
          ) : (
            categories.map((category) => (
              <Link
                key={category._id}
                className="btn btn-light btn-lg btn-block btn-raised m-3 col text-primary"
                to={`/${name && name === 'Categories' ? 'category' : ''}${
                  name && name === 'Subcategories' ? 'subcategory' : ''
                }/${category.slug}`}
              >
                {category.name}
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryDisplay;
