import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import {
  createCategory,
  getAllCategories,
  deleteCategory
} from '../../../api/category';
import Swal from 'sweetalert2';

import AdminNav from '../../../components/nav/AdminNav';
import CategoryForm from '../../../components/forms/CategoryForm';
import SearchForm from '../../../components/forms/SearchForm';

import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const CreateCategory = () => {
  const [name, setName] = useState('');
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const {
    user: { token }
  } = useSelector((state) => ({ ...state }));

  const loadCategories = () => {
    getAllCategories().then((categories) => {
      setCategories(categories.data);
    });
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    createCategory({ name }, token)
      .then((res) => {
        setName('');

        loadCategories();

        toast.success(`${res.data.name} category has been created.`);
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
        deleteCategory(slug, token)
          .then((res) => {
            loadCategories();

            toast.success(`${res.data.name} category has been removed.`);
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
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col">
          <h4>Create Category</h4>
          <CategoryForm
            name={name}
            setName={setName}
            handleSubmit={handleSubmit}
            method="Create"
          />
          <hr />
          <SearchForm
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          {categories.filter(foundCategories(searchQuery)).map((category) => (
            <div className="alert alert-secondary" key={category._id}>
              {category.name}
              <span
                onClick={() => handleDelete(category.name, category.slug)}
                className="btn btn-sm float-right text-danger"
              >
                <DeleteOutlined />
              </span>
              <Link to={`/admin/category/${category.slug}`}>
                <span className="btn btn-sm float-right text-warning">
                  <EditOutlined />
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreateCategory;
