import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { updateCoupon, getCoupon } from '../../../api/coupon';
import moment from 'moment-timezone';

import CouponForm from '../../../components/forms/CouponForm';

moment.tz.setDefault('America/New_York');

const UpdateCoupon = ({
  history,
  match: {
    params: { couponName }
  }
}) => {
  const [name, setName] = useState('');
  const [discount, setDiscount] = useState('');
  const [expiration, setExpiration] = useState('');

  const {
    user: { token }
  } = useSelector((state) => ({ ...state }));

  const unmounted = useRef(false);

  useEffect(() => {
    return () => {
      unmounted.current = true;
    };
  }, []);

  useEffect(() => {
    getCoupon(couponName)
      .then((coupon) => {
        if (coupon.data) {
          const dateObj = new Date(coupon.data.expiration);
          const momentObj = moment(dateObj);

          if (!unmounted.current) {
            setName(coupon.data.name);
            setDiscount(coupon.data.discount);
            setExpiration(momentObj);
          }
        } else {
          history.push('/admin/coupon');
        }
      })
      .catch((error) => {
        toast.error(error.message);
      });
  }, [couponName, history]);

  const handleSubmit = (e) => {
    e.preventDefault();

    updateCoupon({ name, discount, expiration }, couponName, token)
      .then((res) => {
        if (!unmounted.current) {
          setName('');
          setDiscount('');
          setExpiration('');
        }

        toast.success(`${res.data.name} coupon has been updated.`);

        history.push('/admin/coupon');
      })
      .catch((error) => {
        toast.error(error.response.data);
      });
  };

  return (
    <div className="container mt-4">
      <h3 className="text-primary">Update Coupon</h3>
      <CouponForm
        name={name}
        setName={setName}
        discount={discount}
        setDiscount={setDiscount}
        expiration={expiration}
        setExpiration={setExpiration}
        handleSubmit={handleSubmit}
        method="Update"
      />
    </div>
  );
};

export default UpdateCoupon;
