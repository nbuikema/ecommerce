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
