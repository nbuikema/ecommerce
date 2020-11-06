import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllCategories } from '../../../api/category';
import { getAllSubcategories } from '../../../api/subcategory';
import { toast } from 'react-toastify';

import LoadingForm from '../../../components/forms/LoadingForm';

const CategoryDisplay = ({ name }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    name === 'Categories' &&
      getAllCategories()
        .then((res) => {
          setCategories(res.data);
          setLoading(false);
        })
        .catch((error) => {
          toast.error(error.message);

          setLoading(false);
        });

    name === 'Subcategories' &&
      getAllSubcategories()
        .then((res) => {
          setCategories(res.data);
          setLoading(false);
        })
        .catch((error) => {
          toast.error(error.message);

          setLoading(false);
        });
  }, [name]);

  return (
    <div className="pb-5 bg-primary">
      <h4 className="text-center p-3 mb-5 display-4 jumbotron text-primary">
        {name}
      </h4>
      <div className="container">
        <div className="row">
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
