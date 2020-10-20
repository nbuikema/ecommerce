import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { getAllCategories } from '../../../api/category';
import { updateSubcategory, getSubcategory } from '../../../api/subcategory';

import AdminNav from '../../../components/nav/AdminNav';
import CategoryForm from '../../../components/forms/CategoryForm';

const UpdateSubcategory = ({
  history,
  match: {
    params: { slug }
  }
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);

  const {
    user: { token }
  } = useSelector((state) => ({ ...state }));

  const loadCategories = () => {
    getAllCategories().then((categories) => {
      setCategories(categories.data);
    });
  };

  useEffect(() => {
    getSubcategory(slug).then((subcategory) => {
      if (subcategory.data) {
        setName(subcategory.data.name);
        setCategory(subcategory.data.parentCategory);
      } else {
        history.push('/admin/subcategory');
      }
    });
    loadCategories();
  }, [slug, history]);

  const handleSubmit = (e) => {
    e.preventDefault();

    updateSubcategory(slug, { name, parentCategory: category }, token)
      .then((res) => {
        setName('');

        toast.success(`${res.data.name} subcategory has been updated.`);

        history.push('/admin/subcategory');
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
          <h4>Update Subcategory</h4>
          <div className="form-group">
            <label>Parent Category</label>
            <select
              onChange={(e) => setCategory(e.target.value)}
              value={category}
              name="category"
              className="form-control"
            >
              <option value="-1">Select Category</option>
              {categories.length > 0 &&
                categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
            </select>
          </div>
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

export default UpdateSubcategory;
