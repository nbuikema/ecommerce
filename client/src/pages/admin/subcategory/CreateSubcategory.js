import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { getAllCategories } from '../../../api/category';
import {
  createSubcategory,
  getAllSubcategories,
  deleteSubcategory
} from '../../../api/subcategory';
import Swal from 'sweetalert2';

import CategoryForm from '../../../components/forms/CategoryForm';
import SearchForm from '../../../components/forms/SearchForm';

import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const CreateSubcategory = () => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

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

  const loadSubcategories = () => {
    getAllSubcategories()
      .then((subcategories) => {
        if (!unmounted.current) {
          setSubcategories(subcategories.data);
        }
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  useEffect(() => {
    loadCategories();
    loadSubcategories();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    createSubcategory({ name, parentCategory: category }, token)
      .then((res) => {
        if (!unmounted.current) {
          setName('');
          setCategory('-1');
        }

        loadSubcategories();

        toast.success(`${res.data.name} subcategory has been created.`);
      })
      .catch((error) => {
        toast.error(error.response.data);
      });
  };

  const handleDelete = (name, slug) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `You will not be able to recover the ${name} category!`,
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it.'
    }).then((result) => {
      if (result.value) {
        deleteSubcategory(slug, token)
          .then((res) => {
            loadSubcategories();

            toast.success(`${res.data.name} subcategory has been removed.`);
          })
          .catch((error) => {
            toast.error(error.response.data);
          });
      }
    });
  };

  const foundCategories = (searchQuery) => (category) => {
    return category.name.toLowerCase().includes(searchQuery);
  };

  return (
    <div className="container mt-4">
      <h3 className="text-primary">Create Subcategory</h3>
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
        method="Create"
      />
      <hr />
      <SearchForm searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      {subcategories.filter(foundCategories(searchQuery)).map((subcategory) => (
        <div className="alert alert-secondary" key={subcategory._id}>
          {subcategory.name}
          <span
            onClick={() => handleDelete(subcategory.name, subcategory.slug)}
            className="btn btn-sm float-right text-danger"
          >
            <DeleteOutlined />
          </span>
          <Link to={`/admin/subcategory/${subcategory.slug}`}>
            <span className="btn btn-sm float-right text-warning">
              <EditOutlined />
            </span>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default CreateSubcategory;
