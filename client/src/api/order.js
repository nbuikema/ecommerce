import axios from 'axios';

export const getAllOrders = async (authtoken) => {
  return await axios.get(`${process.env.REACT_APP_API}/order/all`, {
    headers: {
      authtoken
    }
  });
};

export const getOrdersByDate = async (authtoken, date) => {
  return await axios.post(
    `${process.env.REACT_APP_API}/order/by-date`,
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
    `${process.env.REACT_APP_API}/order/new`,
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
    `${process.env.REACT_APP_API}/order/update/${orderId}`,
    { orderStatus },
    {
      headers: {
        authtoken
      }
    }
  );
};
