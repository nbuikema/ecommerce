import React, { useState, useEffect, useRef } from 'react';
import {
  getProductsWithFilter,
  getProductsCountWithFilter
} from '../../api/product';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import ShopDisplay from '../../components/displays/ShopDisplay';
import ProductFilterForm from '../../components/forms/ProductFilterForm';

import { Drawer, Button } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [productsCount, setProductsCount] = useState(0);
  const [limit] = useState(6);
  const [page, setPage] = useState(1);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingProductsCount, setLoadingProductsCount] = useState(false);
  const [price, setPrice] = useState([null, null]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [rating, setRating] = useState(null);
  const [shipping, setShipping] = useState(null);
  const [sort, setSort] = useState(['Best Sellers', 'sold', 'desc']);
  const [showFilters, setShowFilters] = useState(false);

  const { search } = useSelector((state) => ({ ...state }));

  const dispatch = useDispatch();

  const unmounted = useRef(false);

  useEffect(() => {
    return () => {
      unmounted.current = true;
    };
  }, []);

  useEffect(() => {
    setLoadingProductsCount(true);
    setPage(1);

    let submitPrice = [];
    if (!search.price[0] && !search.price[1]) {
      submitPrice = [0, 100000000000];
    } else if (search.price[0] && !search.price[1]) {
      submitPrice = [search.price[0], 100000000000];
    } else if (search.price[1] && !search.price[0]) {
      submitPrice = [0, search.price[1]];
    } else {
      submitPrice = search.price;
    }

    getProductsCountWithFilter({
      query: search.text,
      price: submitPrice,
      categories: search.categories,
      subcategories: search.subcategories,
      rating: search.rating,
      shipping: search.shipping,
      sort: [search.sort[1], search.sort[2]]
    })
      .then((res) => {
        if (!unmounted.current) {
          setProductsCount(res.data);
          setLoadingProductsCount(false);
        }
      })
      .catch((error) => {
        if (!unmounted.current) {
          toast.error(error.message);

          setLoadingProductsCount(false);
        }
      });
  }, [
    search.text,
    search.price,
    search.categories,
    search.subcategories,
    search.rating,
    search.shipping,
    search.sort
  ]);

  useEffect(() => {
    setLoadingProducts(true);

    let submitPrice = [];
    if (!search.price[0] && !search.price[1]) {
      submitPrice = [0, 100000000000];
    } else if (search.price[0] && !search.price[1]) {
      submitPrice = [search.price[0], 100000000000];
    } else if (search.price[1] && !search.price[0]) {
      submitPrice = [0, search.price[1]];
    } else {
      submitPrice = search.price;
    }

    getProductsWithFilter({
      query: search.text,
      price: submitPrice,
      categories: search.categories,
      subcategories: search.subcategories,
      rating: search.rating,
      shipping: search.shipping,
      sort: [search.sort[1], search.sort[2]],
      limit,
      page
    })
      .then((products) => {
        if (!unmounted.current) {
          setProducts(products.data);
          setLoadingProducts(false);
        }
      })
      .catch((error) => {
        if (!unmounted.current) {
          toast.error(error.message);

          setLoadingProducts(false);
        }
      });
    // eslint-disable-next-line
  }, [
    page,
    search.text,
    search.price,
    search.categories,
    search.subcategories,
    search.rating,
    search.shipping,
    search.sort
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();

    setLoadingProducts(true);

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

    dispatch({
      type: 'SEARCH_QUERY',
      payload: {
        sort,
        price,
        categories,
        subcategories,
        rating,
        shipping
      }
    });

    getProductsWithFilter({
      query: search.text,
      price: submitPrice,
      categories,
      subcategories,
      rating,
      shipping,
      sort: [sort[1], sort[2]],
      limit,
      page
    })
      .then((products) => {
        if (!unmounted.current) {
          setProducts(products.data);
          setLoadingProducts(false);
        }
      })
      .catch((error) => {
        if (!unmounted.current) {
          toast.error(error.message);

          setLoadingProducts(false);
        }
      });
  };

  return (
    <div className="container-fluid bg-primary">
      <div className="row pt-4">
        <div className="col-lg-3">
          <h4 className="text-primary">
            Search/Filter
            <span className="float-right d-block d-lg-none">
              <Button
                onClick={() => setShowFilters(true)}
                type="danger"
                className="mb-5"
                block
                shape="round"
                icon={<CaretRightOutlined />}
                size="medium"
              >
                Toggle Filters
              </Button>
            </span>
          </h4>
          <hr className="d-block d-lg-none" />
          <Drawer
            title="Search/Filter"
            placement="left"
            visible={showFilters}
            onClose={() => setShowFilters(false)}
            width={375}
            className="d-block d-lg-none text-center"
          >
            <ProductFilterForm
              setSort={setSort}
              sort={sort}
              setPrice={setPrice}
              price={price}
              setCategories={setCategories}
              categories={categories}
              setSubcategories={setSubcategories}
              subcategories={subcategories}
              setRating={setRating}
              rating={rating}
              setShipping={setShipping}
              shipping={shipping}
              handleSubmit={handleSubmit}
            />
          </Drawer>
          <div className="d-none d-lg-block">
            <ProductFilterForm
              setSort={setSort}
              sort={sort}
              setPrice={setPrice}
              price={price}
              setCategories={setCategories}
              categories={categories}
              setSubcategories={setSubcategories}
              subcategories={subcategories}
              setRating={setRating}
              rating={rating}
              setShipping={setShipping}
              shipping={shipping}
              handleSubmit={handleSubmit}
            />
          </div>
        </div>
        <div className="col-lg-9">
          <h4 className="text-primary">
            {loadingProductsCount
              ? 'Loading...'
              : productsCount > 0
              ? `${productsCount} ${
                  productsCount === 1 ? 'product' : 'products'
                } found`
              : 'No products found'}
          </h4>
          <hr />
          <ShopDisplay
            productsCount={productsCount}
            products={products}
            loadingProducts={loadingProducts}
            loadingProductsCount={loadingProductsCount}
            page={page}
            setPage={setPage}
            limit={limit}
          />
        </div>
      </div>
    </div>
  );
};

export default Shop;
