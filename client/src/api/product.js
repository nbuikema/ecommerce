import axios from 'axios';

// create product
export const createProduct = async (product, authtoken) => {
  return await axios.post(
    `${process.env.REACT_APP_API}/product/create`,
    product,
    {
      headers: {
        authtoken
      }
    }
  );
};

// read products
export const getProduct = async (slug) => {
  return await axios.get(`${process.env.REACT_APP_API}/product/read/${slug}`);
};

export const getProductsByCount = async (count) => {
  return await axios.get(`${process.env.REACT_APP_API}/product/all/${count}`);
};

export const getProductsCount = async () => {
  return await axios.get(`${process.env.REACT_APP_API}/product/count`);
};

export const getProductsWithQuery = async (sort, order, limit, page) => {
  return await axios.post(`${process.env.REACT_APP_API}/product/query`, {
    sort,
    order,
    limit,
    page
  });
};

export const getRelatedProducts = async (productId) => {
  return await axios.get(
    `${process.env.REACT_APP_API}/product/related/${productId}`
  );
};

export const getProductsInCategory = async (categorySlug) => {
  return await axios.get(
    `${process.env.REACT_APP_API}/product/by/category/${categorySlug}`
  );
};

export const getProductsInSubcategory = async (subcategorySlug) => {
  return await axios.get(
    `${process.env.REACT_APP_API}/product/by/subcategory/${subcategorySlug}`
  );
};

export const getProductsWithFilter = async (args) => {
  return await axios.post(
    `${process.env.REACT_APP_API}/product/search/filters`,
    args
  );
};

export const getProductsBySoldValue = async () => {
  return await axios.get(`${process.env.REACT_APP_API}/product/sold-value`);
};

// update product
export const updateProduct = async (slug, product, authtoken) => {
  return await axios.put(
    `${process.env.REACT_APP_API}/product/update/${slug}`,
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
  return await axios.delete(
    `${process.env.REACT_APP_API}/product/delete/${slug}`,
    {
      headers: {
        authtoken
      }
    }
  );
};
