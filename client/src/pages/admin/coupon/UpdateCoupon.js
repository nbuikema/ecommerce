import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { updateCoupon, getCoupon } from '../../../api/coupon';
import moment from 'moment-timezone';

import AdminNav from '../../../components/nav/AdminNav';
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

  useEffect(() => {
    getCoupon(couponName).then((coupon) => {
      if (coupon.data) {
        setName(coupon.data.name);
        setDiscount(coupon.data.discount);

        const dateObj = new Date(coupon.data.expiration);
        const momentObj = moment(dateObj);

        setExpiration(momentObj);
      } else {
        history.push('/admin/coupon');
      }
    });
  }, [couponName, history]);

  const handleSubmit = (e) => {
    e.preventDefault();

    updateCoupon({ name, discount, expiration }, couponName, token)
      .then((res) => {
        setName('');
        setDiscount('');
        setExpiration('');

        toast.success(`${res.data.name} coupon has been updated.`);

        history.push('/admin/coupon');
      })
      .catch((error) => {
        toast.error(error.response.data);
      });
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col">
          <h4>Update Coupon</h4>
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
      </div>
    </div>
  );
};

export default UpdateCoupon;
