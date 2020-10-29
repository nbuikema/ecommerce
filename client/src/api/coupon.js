import axios from 'axios';

// create coupon
export const createCoupon = async (coupon, authtoken) => {
  return await axios.post(
    `${process.env.REACT_APP_API}/coupon/create`,
    coupon,
    {
      headers: {
        authtoken
      }
    }
  );
};

// read coupons
export const getAllCoupons = async () => {
  return await axios.get(`${process.env.REACT_APP_API}/coupon/all`);
};

export const getCoupon = async (couponName) => {
  return await axios.get(
    `${process.env.REACT_APP_API}/coupon/read/${couponName}`
  );
};

// update coupon
export const updateCoupon = async (coupon, couponName, authtoken) => {
  return await axios.put(
    `${process.env.REACT_APP_API}/coupon/update/${couponName}`,
    coupon,
    {
      headers: {
        authtoken
      }
    }
  );
};

// delete coupon
export const deleteCoupon = async (couponId, authtoken) => {
  return await axios.delete(
    `${process.env.REACT_APP_API}/coupon/delete/${couponId}`,
    {
      headers: {
        authtoken
      }
    }
  );
};
