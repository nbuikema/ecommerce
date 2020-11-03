import axios from 'axios';

export const updateCart = async (cart, cartItem, authtoken) => {
  return await axios.put(
    `${process.env.REACT_APP_API}/user/cart`,
    { cart, cartItem },
    {
      headers: {
        authtoken
      }
    }
  );
};

export const updateAddress = async (address, authtoken) => {
  return await axios.put(
    `${process.env.REACT_APP_API}/user/address`,
    { address },
    {
      headers: {
        authtoken
      }
    }
  );
};

export const getWishlist = async (authtoken) => {
  return await axios.get(`${process.env.REACT_APP_API}/user/wishlist`, {
    headers: {
      authtoken
    }
  });
};

export const addToWishlist = async (authtoken, productId) => {
  return await axios.post(
    `${process.env.REACT_APP_API}/user/wishlist`,
    {
      productId
    },
    {
      headers: {
        authtoken
      }
    }
  );
};

export const removeFromWishlist = async (authtoken, productId) => {
  return await axios.put(
    `${process.env.REACT_APP_API}/user/wishlist/${productId}`,
    {},
    {
      headers: {
        authtoken
      }
    }
  );
};
