import axios from 'axios';

export const updateCart = async (cart, cartItem, authtoken) => {
  return await axios.put(
    `${process.env.REACT_APP_API}/user/update-cart`,
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
    `${process.env.REACT_APP_API}/user/update-address`,
    { address },
    {
      headers: {
        authtoken
      }
    }
  );
};

export const readCart = async (authtoken) => {
  return await axios.get(`${process.env.REACT_APP_API}/user/read-cart`, {
    headers: {
      authtoken
    }
  });
};
