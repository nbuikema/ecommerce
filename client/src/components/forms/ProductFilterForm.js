import React, { useState, useEffect, useRef } from 'react';
import { getAllCategories } from '../../api/category';
import { getAllSubcategories } from '../../api/subcategory';
import { useSelector, useDispatch } from 'react-redux';

import RatingsForm from '../../components/forms/RatingsForm';
import LoadingForm from '../../components/forms/LoadingForm';

import { Menu, InputNumber, Button, Checkbox, Select } from 'antd';
import {
  DollarOutlined,
  DownSquareOutlined,
  StarOutlined,
  SearchOutlined,
  SortAscendingOutlined,
  CloseOutlined
} from '@ant-design/icons';
const { SubMenu } = Menu;
const { Option } = Select;

const ProductFilterForm = ({
  setSort,
  setPrice,
  setCategories,
  setSubcategories,
  setRating,
  setShipping,
  sort,
  price,
  categories,
  subcategories,
  rating,
  shipping,
  handleSubmit,
  loadingProducts
}) => {
  const [allCategories, setAllCategories] = useState([]);
  const [allSubcategories, setAllSubcategories] = useState([]);
  const [loadingFilters, setLoadingFilters] = useState(false);

  const { search } = useSelector((state) => ({ ...state }));

  const dispatch = useDispatch();

  const unmounted = useRef(false);

  useEffect(() => {
    return () => {
      unmounted.current = true;
    };
  }, []);

  useEffect(() => {
    setLoadingFilters(true);
    setSort(search.sort);
    setPrice(search.price);
    setCategories(search.categories);
    setSubcategories(search.subcategories);
    setRating(search.rating);
    setShipping(search.shipping);

    getAllCategories().then((categories) => {
      if (!unmounted.current) {
        setAllCategories(categories.data);
      }
    });

    getAllSubcategories().then((subcategories) => {
      if (!unmounted.current) {
        setAllSubcategories(subcategories.data);
        setLoadingFilters(false);
      }
    });

    // eslint-disable-next-line
  }, []);

  const handleCategories = (e) => {
    const currentCategories = [...categories];
    const newCategory = e.target.value;
    const exists = currentCategories.indexOf(newCategory);

    if (exists === -1) {
      currentCategories.push(newCategory);
    } else {
      currentCategories.splice(exists, 1);
    }

    setCategories(currentCategories);
  };

  const handleSubcategories = (id) => {
    const currentSubcategories = [...subcategories];
    const newSubcategory = id;
    const exists = currentSubcategories.indexOf(newSubcategory);

    if (exists === -1) {
      currentSubcategories.push(newSubcategory);
    } else {
      currentSubcategories.splice(exists, 1);
    }

    setSubcategories(currentSubcategories);
  };

  const handleRating = (rating) => {
    setRating(rating);
  };

  const handleClearFilters = (e) => {
    e.preventDefault();

    setPrice([null, null]);
    setCategories([]);
    setSubcategories([]);
    setRating(null);
    setShipping(null);
    setSort(['Best Sellers', 'sold', 'desc']);

    dispatch({
      type: 'SEARCH_QUERY',
      payload: {
        sort: ['Best Sellers', 'sold', 'desc'],
        price: [null, null],
        categories: [],
        subcategories: [],
        rating: null,
        shipping: null
      }
    });
  };

  return (
    <Menu
      defaultOpenKeys={[
        'price',
        'category',
        'subcategory',
        'rating',
        'sort',
        'shipping'
      ]}
      mode="inline"
      className="bg-primary text-primary border-right border-top mt-lg-3"
    >
      <SubMenu
        key="sort"
        title={
          <span className="h5">
            <SortAscendingOutlined />
            Sort By
          </span>
        }
      >
        <div className="bg-primary px-4">
          <Select
            className="w-100 text-primary"
            value={sort}
            onChange={(value) => setSort(value)}
          >
            <Option value={['Best Sellers', 'sold', 'desc']}>
              Best Sellers
            </Option>
            <Option value={['Price: Low to High', 'price', 'asc']}>
              Price: Low to High
            </Option>
            <Option value={['Price: High to Low', 'price', 'desc']}>
              Price: High to Low
            </Option>
          </Select>
        </div>
      </SubMenu>
      <SubMenu
        key="price"
        title={
          <span className="h5">
            <DollarOutlined />
            Price
          </span>
        }
        className="mt-4"
      >
        <div className="bg-primary px-4">
          <span>
            <InputNumber
              placeholder="Min"
              value={price[0] ? price[0] : ''}
              onChange={(value) => setPrice([value, price[1]])}
              min={0}
              formatter={(value) => (value ? `$ ${value}` : '')}
              className="mr-3 mb-2"
            />
          </span>
          <span>
            <InputNumber
              placeholder="Max"
              value={price[1]}
              onChange={(value) => setPrice([price[0], value])}
              formatter={(value) => (value ? `$ ${value}` : '')}
              min={price[0] + 1}
            />
          </span>
        </div>
      </SubMenu>
      <SubMenu
        key="category"
        title={
          <span className="h5">
            <DownSquareOutlined />
            Categories
          </span>
        }
        className="mt-4"
      >
        <div className="bg-primary px-4">
          {loadingFilters ? (
            <div className="mr-4">
              <LoadingForm />
            </div>
          ) : (
            allCategories &&
            allCategories.length > 0 &&
            allCategories.map((category) => (
              <div key={category._id}>
                <Checkbox
                  name="category"
                  className="pb-2"
                  value={category._id}
                  onChange={handleCategories}
                  checked={categories.includes(category._id)}
                >
                  <span className="h6 text-primary">{category.name}</span>
                </Checkbox>
              </div>
            ))
          )}
        </div>
      </SubMenu>
      <SubMenu
        key="subcategory"
        title={
          <span className="h5">
            <DownSquareOutlined />
            Subcategories
          </span>
        }
        className="mt-4"
      >
        <div className="bg-primary px-4">
          {loadingFilters ? (
            <div className="mr-4">
              <LoadingForm />
            </div>
          ) : (
            allSubcategories &&
            allSubcategories.length > 0 &&
            allSubcategories.map((subcategory) => (
              <div
                onClick={() => handleSubcategories(subcategory._id)}
                key={subcategory._id}
                className={`p-1 m-1 badge badge-pill ${
                  subcategories.includes(subcategory._id)
                    ? 'badge-danger'
                    : 'badge-primary'
                }`}
                style={{ cursor: 'pointer' }}
              >
                <h6 className="text-white m-0 px-1">{subcategory.name}</h6>
              </div>
            ))
          )}
        </div>
      </SubMenu>
      <SubMenu
        key="rating"
        title={
          <span className="h5">
            <StarOutlined />
            Rating
          </span>
        }
        className="mt-4"
      >
        <div className="bg-primary px-4">
          <RatingsForm
            starClick={handleRating}
            numberOfStars={5}
            rating={rating}
          />
          <br />
          <RatingsForm
            starClick={handleRating}
            numberOfStars={4}
            rating={rating}
          />
          <br />
          <RatingsForm
            starClick={handleRating}
            numberOfStars={3}
            rating={rating}
          />
          <br />
          <RatingsForm
            starClick={handleRating}
            numberOfStars={2}
            rating={rating}
          />
          <br />
          <RatingsForm
            starClick={handleRating}
            numberOfStars={1}
            rating={rating}
          />
        </div>
      </SubMenu>
      <SubMenu
        key="shipping"
        title={
          <span className="h5">
            <SortAscendingOutlined />
            Shipping
          </span>
        }
        className="mt-4"
      >
        <div className="bg-primary px-4">
          <Select
            className="w-100 text-primary"
            defaultValue={null}
            value={shipping && shipping}
            onChange={(value) => setShipping(value)}
          >
            <Option value={null}>Select</Option>
            <Option value={true}>Yes</Option>
            <Option value={false}>No</Option>
          </Select>
        </div>
      </SubMenu>
      <div className="mt-4 px-4">
        <Button
          onClick={handleSubmit}
          type="primary"
          className="mb-3"
          block
          shape="round"
          icon={<SearchOutlined />}
          size="large"
          disabled={loadingFilters || loadingProducts}
        >
          Search
        </Button>
        <Button
          onClick={handleClearFilters}
          type="danger"
          className="mb-3 float-right"
          shape="round"
          icon={<CloseOutlined />}
          size="small"
          disabled={loadingFilters || loadingProducts}
        >
          Clear Filters
        </Button>
      </div>
    </Menu>
  );
};

export default ProductFilterForm;
