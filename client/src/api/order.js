import axios from 'axios';

export const getAllOrders = async (authtoken) => {
  return await axios.get(`${process.env.REACT_APP_API}/orders`, {
    headers: {
      authtoken
    }
  });
};

export const getOrdersByDate = async (authtoken, date) => {
  return await axios.post(
    `${process.env.REACT_APP_API}/orders/date`,
    {
      date
    },
    {
      headers: {
        authtoken
      }
    }
  );
};

export const getNewOrders = async (authtoken, lastLogin) => {
  return await axios.post(
    `${process.env.REACT_APP_API}/orders/new`,
    {
      lastLogin
    },
    {
      headers: {
        authtoken
      }
    }
  );
};

export const updateOrder = async (authtoken, orderId, orderStatus) => {
  return await axios.put(
    `${process.env.REACT_APP_API}/order/${orderId}`,
    { orderStatus },
    {
      headers: {
        authtoken
      }
    }
  );
};

export const createOrder = async (authtoken, cart, address, paymentIntent) => {
  return await axios.post(
    `${process.env.REACT_APP_API}/order`,
    { address, cart, paymentIntent },
    {
      headers: {
        authtoken
      }
    }
  );
};
