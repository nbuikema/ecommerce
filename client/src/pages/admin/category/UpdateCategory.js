import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { updateCategory, getCategory } from '../../../api/category';

import AdminNav from '../../../components/nav/AdminNav';
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

  useEffect(() => {
    getCategory(slug).then((category) => {
      if (category.data) {
        setName(category.data.name);
      } else {
        history.push('/admin/category');
      }
    });
  }, [slug, history]);

  const handleSubmit = (e) => {
    e.preventDefault();

    updateCategory(slug, { name }, token)
      .then((res) => {
        setName('');

        toast.success(`${res.data.name} category has been updated.`);

        history.push('/admin/category');
      })
      .catch((error) => {
        toast.error(error.response.data);
      });
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col">
          <h4>Update Category</h4>
          <CategoryForm
            name={name}
            setName={setName}
            handleSubmit={handleSubmit}
            method="Update"
          />
        </div>
      </div>
    </div>
  );
};

export default UpdateCategory;
