import axios from 'axios';

// create product
export const createProduct = async (product, authtoken) => {
  return await axios.post(`${process.env.REACT_APP_API}/product`, product, {
    headers: {
      authtoken
    }
  });
};

// read products
export const getProduct = async (slug) => {
  return await axios.get(`${process.env.REACT_APP_API}/product/${slug}`);
};

export const getProductsByCount = async (count) => {
  return await axios.get(`${process.env.REACT_APP_API}/products/${count}`);
};

export const getProductsCount = async () => {
  return await axios.get(`${process.env.REACT_APP_API}/products/count`);
};

export const getProductsCountWithFilter = async (args) => {
  return await axios.post(
    `${process.env.REACT_APP_API}/products/count/search/filters`,
    args
  );
};

export const getProductsWithQuery = async (sort, order, limit, page) => {
  return await axios.post(`${process.env.REACT_APP_API}/products/query`, {
    sort,
    order,
    limit,
    page
  });
};

export const getRelatedProducts = async (productId) => {
  return await axios.get(
    `${process.env.REACT_APP_API}/products/related/${productId}`
  );
};

export const getProductsInCategory = async (categorySlug) => {
  return await axios.get(
    `${process.env.REACT_APP_API}/products/category/${categorySlug}`
  );
};

export const getProductsInSubcategory = async (subcategorySlug) => {
  return await axios.get(
    `${process.env.REACT_APP_API}/products/subcategory/${subcategorySlug}`
  );
};

export const getProductsWithFilter = async (args) => {
  return await axios.post(
    `${process.env.REACT_APP_API}/products/search/filters`,
    args
  );
};

export const getProductsByDate = async (authtoken, date, sort) => {
  return await axios.post(
    `${process.env.REACT_APP_API}/products/sold`,
    {
      date,
      sort
    },
    {
      headers: {
        authtoken
      }
    }
  );
};

export const getProductsByInventory = async (authtoken, sort) => {
  return await axios.post(
    `${process.env.REACT_APP_API}/products/inventory`,
    {
      sort
    },
    {
      headers: {
        authtoken
      }
    }
  );
};

// update product
export const updateProduct = async (slug, product, authtoken) => {
  return await axios.put(
    `${process.env.REACT_APP_API}/product/${slug}`,
    product,
    {
      headers: {
        authtoken
      }
    }
  );
};

export const rateProduct = async (productId, rating, authtoken) => {
  return await axios.put(
    `${process.env.REACT_APP_API}/product/rate/${productId}`,
    { rating },
    {
      headers: {
        authtoken
      }
    }
  );
};

// delete product
export const deleteProduct = async (slug, authtoken) => {
  return await axios.delete(`${process.env.REACT_APP_API}/product/${slug}`, {
    headers: {
      authtoken
    }
  });
};
