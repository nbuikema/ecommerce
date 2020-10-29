import axios from 'axios';

export const createPaymentIntent = async (
  authtoken,
  cart,
  address,
  coupon,
  discount
) => {
  return await axios.post(
    `${process.env.REACT_APP_API}/stripe/create-payment-intent`,
    { cart, address, coupon, discount },
    {
      headers: {
        authtoken
      }
    }
  );
};
