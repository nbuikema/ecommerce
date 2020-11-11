import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { getAllCategories } from '../../../api/category';
import { updateSubcategory, getSubcategory } from '../../../api/subcategory';

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
    getSubcategory(slug)
      .then((subcategory) => {
        if (subcategory.data) {
          if (!unmounted.current) {
            setName(subcategory.data.name);
            setCategory(subcategory.data.parentCategory);
          }
        } else {
          history.push('/admin/subcategory');
        }
      })
      .catch((error) => {
        toast.error(error.message);
      });
    loadCategories();
  }, [slug, history]);

  const handleSubmit = (e) => {
    e.preventDefault();

    updateSubcategory(slug, { name, parentCategory: category }, token)
      .then((res) => {
        if (!unmounted.current) {
          setName('');
        }

        toast.success(`${res.data.name} subcategory has been updated.`);

        history.push('/admin/subcategory');
      })
      .catch((error) => {
        toast.error(error.response.data);
      });
  };

  return (
    <div className="container mt-4">
      <h3 className="text-primary">Update Subcategory</h3>
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
  );
};

export default UpdateSubcategory;
