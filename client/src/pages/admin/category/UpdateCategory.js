import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { updateCategory, getCategory } from '../../../api/category';

import CategoryForm from '../../../components/forms/CategoryForm';

const UpdateCategory = ({
  history,
  match: {
    params: { slug }
  }
}) => {
  const [name, setName] = useState('');

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
    getCategory(slug)
      .then((category) => {
        if (category.data) {
          if (!unmounted.current) {
            setName(category.data.name);
          }
        } else {
          history.push('/admin/category');
        }
      })
      .catch((error) => {
        toast.error(error.message);
      });
  }, [slug, history]);

  const handleSubmit = (e) => {
    e.preventDefault();

    updateCategory(slug, { name }, token)
      .then((res) => {
        if (!unmounted.current) {
          setName('');
        }

        toast.success(`${res.data.name} category has been updated.`);

        history.push('/admin/category');
      })
      .catch((error) => {
        toast.error(error.response.data);
      });
  };

  return (
    <div className="container mt-4">
      <h3 className="text-primary">Update Category</h3>
      <CategoryForm
        name={name}
        setName={setName}
        handleSubmit={handleSubmit}
        method="Update"
      />
    </div>
  );
};

export default UpdateCategory;
