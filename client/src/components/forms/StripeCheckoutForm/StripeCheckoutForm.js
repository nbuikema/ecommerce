import React, { useState, useEffect, useRef } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useSelector, useDispatch } from 'react-redux';
import { createPaymentIntent } from '../../../api/stripe';
import { createOrder } from '../../../api/order';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import { DollarOutlined } from '@ant-design/icons';

import './StripeCheckoutForm.css';

const StripeCheckoutForm = ({
  address,
  succeeded,
  setSucceeded,
  processing,
  setProcessing
}) => {
  const [error, setError] = useState(null);
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState('');

  const {
    user,
    cart: { cart, coupon }
  } = useSelector((state) => ({ ...state }));

  const dispatch = useDispatch();

  const stripe = useStripe();
  const elements = useElements();

  const unmounted = useRef(false);

  useEffect(() => {
    return () => {
      unmounted.current = true;
    };
  }, []);

  useEffect(() => {
    !succeeded &&
      createPaymentIntent(
        user.token,
        cart,
        address,
        coupon.name,
        coupon.discount
      )
        .then((res) => {
          if (!unmounted.current) {
            setClientSecret(res.data.clientSecret);
          }
        })
        .catch((error) => {
          if (!unmounted.current) {
            setError(error.message);
          }

          toast.error(error.message);
        });

    // eslint-disable-next-line
  }, [coupon, address, cart]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: e.target.name.value
        }
      }
    });

    if (payload.error) {
      if (!unmounted.current) {
        setError(`Payment failed: ${payload.error.message}`);
        setProcessing(false);
      }
    } else {
      createOrder(user.token, cart, address, payload, coupon._id)
        .then(async (res) => {
          if (!unmounted.current) {
            elements.getElement(CardElement).clear();

            setError(null);
            setProcessing(false);
            setSucceeded(true);
          }

          const updateUser = await { ...res.data, token: user.token };

          dispatch({
            type: 'UPDATE_USER',
            payload: updateUser
          });

          dispatch({
            type: 'EMPTY_CART'
          });

          dispatch({
            type: 'REMOVE_COUPON'
          });
        })
        .catch((error) => {
          toast.error(error.message);
        });
    }
  };

  const handleChange = async (e) => {
    setDisabled(e.empty);
    setError(e.error ? e.error.message : '');
  };

  const cartStyle = {
    style: {
      base: {
        color: '#32325d',
        fontFamily: 'Arial, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#32325d'
        }
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
      }
    }
  };

  return (
    <>
      <h6 className={succeeded ? 'result-message' : 'result-message hidden'}>
        Payment Successful.{' '}
        <Link to="/user/orders">See it in your purchase history.</Link>
      </h6>
      <form id="payment-form" className="stripe-form" onSubmit={handleSubmit}>
        <CardElement
          id="card-element"
          options={cartStyle}
          onChange={handleChange}
        />
        <button
          type="submit"
          className="my-3 btn btn-success btn-block btn-raised ant-btn-round"
          style={{ fontSize: '20px', height: '40px' }}
          disabled={processing || disabled || succeeded}
        >
          <DollarOutlined /> Pay
        </button>
        <br />
        {error && (
          <div className="card-error" role="alert">
            {error}
          </div>
        )}
      </form>
    </>
  );
};

export default StripeCheckoutForm;
