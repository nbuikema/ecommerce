import React, { useState, useEffect } from 'react';
import {
  getProductsWithFilter,
  getProductsCountWithFilter
} from '../../api/product';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import ShopDisplay from '../../components/displays/ShopDisplay';
import ProductFilterForm from '../../components/forms/ProductFilterForm';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [productsCount, setProductsCount] = useState(0);
  const [limit] = useState(3);
  const [page, setPage] = useState(1);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingProductsCount, setLoadingProductsCount] = useState(false);
  const [price, setPrice] = useState([null, null]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [rating, setRating] = useState(null);
  const [shipping, setShipping] = useState(null);
  const [sort, setSort] = useState(['Best Sellers', 'sold', 'desc']);

  const { search } = useSelector((state) => ({ ...state }));

  const dispatch = useDispatch();

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
        setProductsCount(res.data);
        setLoadingProductsCount(false);
      })
      .catch((error) => {
        toast.error(error.message);
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
    }).then((products) => {
      setProducts(products.data);
      setLoadingProducts(false);
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
    }).then((products) => {
      setProducts(products.data);
      setLoadingProducts(false);
    });
  };

  return (
    <div className="container-fluid">
      <div className="row mt-4">
        <div className="col-md-3">
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
        <div className="col-md-9">
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
