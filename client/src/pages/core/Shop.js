import React, { useState, useEffect } from 'react';
import { getProductsWithFilter } from '../../api/product';
import { getAllCategories } from '../../api/category';
import { getAllSubcategories } from '../../api/subcategory';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import ProductCard from '../../components/cards/ProductCard';
import RatingsForm from '../../components/forms/RatingsForm';

import { Menu, InputNumber, Button, Checkbox, Select } from 'antd';
import {
  DollarOutlined,
  DownSquareOutlined,
  StarOutlined,
  SearchOutlined,
  SortAscendingOutlined
} from '@ant-design/icons';
const { SubMenu } = Menu;
const { Option } = Select;

const Shop = () => {
  const [allCategories, setAllCategories] = useState([]);
  const [allSubcategories, setAllSubcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [price, setPrice] = useState([null, null]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [rating, setRating] = useState(null);
  const [shipping, setShipping] = useState(null);
  const [sort, setSort] = useState(['Best Sellers', 'sold', 'desc']);

  const {
    search: { text }
  } = useSelector((state) => ({ ...state }));

  const history = useHistory();

  useEffect(() => {
    let subscribed = true;

    getAllCategories().then((categories) => {
      if (subscribed) {
        setAllCategories(categories.data);
      }
    });

    getAllSubcategories().then((subcategories) => {
      if (subscribed) {
        setAllSubcategories(subcategories.data);
      }
    });

    if (history.location.search && history.location.search.length > 0) {
      const params = history.location.search.split('?');
      params.shift();

      let search = [];
      params.forEach((param) => {
        search.push(param.split('='));
      });

      search.forEach((filter) => {
        if (filter[0] === 'shipping') {
          const booleanShipping = filter[1] === 'true';
          setShipping(booleanShipping);
        }
      });
    }

    let submitPrice = [];
    if (!price[0] && !price[1]) {
      submitPrice = [0, 100000000000];
    } else if (price[0] && !price[1]) {
      submitPrice = [price[0], 100000000000];
    } else if (price[1] && !price[0]) {
      submitPrice = [0, price[1]];
    } else {
      submitPrice = price;
    }

    getProductsWithFilter({
      query: text,
      price: submitPrice,
      categories,
      subcategories,
      rating,
      shipping,
      sort: [sort[1], sort[2]]
    }).then((products) => {
      if (subscribed) {
        setProducts(products.data);
      }
    });

    return () => (subscribed = false);

    // eslint-disable-next-line
  }, [text]);

  const handleSubmit = (e) => {
    e.preventDefault();

    let submitPrice = [];
    if (!price[0] && !price[1]) {
      submitPrice = [0, 100000000000];
    } else if (price[0] && !price[1]) {
      submitPrice = [price[0], 100000000000];
    } else if (price[1] && !price[0]) {
      submitPrice = [0, price[1]];
    } else {
      submitPrice = price;
    }

    getProductsWithFilter({
      query: text,
      price: submitPrice,
      categories,
      subcategories,
      rating,
      shipping,
      sort: [sort[1], sort[2]]
    }).then((products) => {
      setProducts(products.data);

      let path = '';

      if (text) {
        path += `?text=${text}`;
      }
      if (price[0]) {
        path += `?price=gt${price[0]}`;
      }
      if (price[1]) {
        path += `?price=lt${price[1]}`;
      }
      if (categories && categories.length > 0) {
        path += `?categories=`;
        categories.forEach((category, index, categories) => {
          if (Object.is(categories.length - 1, index)) {
            path += `${category}`;
          } else {
            path += `${category}&`;
          }
        });
      }
      if (subcategories && subcategories.length > 0) {
        path += `?subcategories=`;
        subcategories.forEach((subcategory, index, subcategories) => {
          if (Object.is(subcategories.length - 1, index)) {
            path += `${subcategory}`;
          } else {
            path += `${subcategory}&`;
          }
        });
      }
      if (rating) {
        path += `?rating=${rating}`;
      }
      if (shipping !== null) {
        path += `?shipping=${shipping}`;
      }
      if (sort) {
        path += `?sort=${sort[1]}-${sort[2]}`;
      }

      history.push(`/shop${path}`);
    });
  };

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

  return (
    <div className="container-fluid">
      <div className="row mt-4">
        <div className="col-md-3">
          <h4>Search/Filter</h4>
          <hr />
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
          >
            <SubMenu
              key="sort"
              title={
                <span className="h6">
                  <SortAscendingOutlined />
                  Sort By
                </span>
              }
            >
              <div className="pl-4">
                <Select
                  className="w-100"
                  defaultValue={['Best Sellers', 'sold', 'desc']}
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
                <span className="h6">
                  <DollarOutlined />
                  Price
                </span>
              }
              className="mt-4"
            >
              <div className="pl-4">
                <span>
                  ${' '}
                  <InputNumber
                    placeholder="Min"
                    value={price[0]}
                    onChange={(value) => setPrice([value, price[1]])}
                    min={0}
                  />
                </span>
                {'    '}-{'    '}
                <span>
                  ${' '}
                  <InputNumber
                    placeholder="Max"
                    value={price[1]}
                    onChange={(value) => setPrice([price[0], value])}
                    min={price[0] + 1}
                  />
                </span>
              </div>
            </SubMenu>
            <SubMenu
              key="category"
              title={
                <span className="h6">
                  <DownSquareOutlined />
                  Categories
                </span>
              }
              className="mt-4"
            >
              <div className="pl-4">
                {allCategories &&
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
                        {category.name}
                      </Checkbox>
                    </div>
                  ))}
              </div>
            </SubMenu>
            <SubMenu
              key="subcategory"
              title={
                <span className="h6">
                  <DownSquareOutlined />
                  Subcategories
                </span>
              }
              className="mt-4"
            >
              <div className="pl-4">
                {allSubcategories &&
                  allSubcategories.length > 0 &&
                  allSubcategories.map((subcategory) => (
                    <div
                      onClick={() => handleSubcategories(subcategory._id)}
                      key={subcategory._id}
                      className={`p-1 m-1 badge ${
                        subcategories.includes(subcategory._id)
                          ? 'badge-danger'
                          : 'badge-secondary'
                      }`}
                      style={{ cursor: 'pointer' }}
                    >
                      {subcategory.name}
                    </div>
                  ))}
              </div>
            </SubMenu>
            <SubMenu
              key="rating"
              title={
                <span className="h6">
                  <StarOutlined />
                  Rating
                </span>
              }
              className="mt-4"
            >
              <div className="pl-4">
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
                <span className="h6">
                  <SortAscendingOutlined />
                  Shipping
                </span>
              }
              className="mt-4"
            >
              <div className="pl-4">
                <Select
                  className="w-100"
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
            <div className="mt-4">
              <Button
                onClick={handleSubmit}
                type="primary"
                className="mb-3"
                block
                shape="round"
                icon={<SearchOutlined />}
                size="large"
              >
                Search
              </Button>
            </div>
          </Menu>
        </div>
        <div className="col-md-9">
          <h4>Products</h4>
          <h6>
            {products.length > 0
              ? `${products.length} ${
                  products.length === 1 ? 'product' : 'products'
                } found`
              : 'No products found'}
          </h6>
          <div className="row">
            {products.map((product) => (
              <div key={product._id} className="col-md-4 pb-4 d-flex">
                <ProductCard product={product} showCustomer={true} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
