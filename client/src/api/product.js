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
