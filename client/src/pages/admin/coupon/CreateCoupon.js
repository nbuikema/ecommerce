import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { createCoupon, getAllCoupons, deleteCoupon } from '../../../api/coupon';
import Swal from 'sweetalert2';
import moment from 'moment-timezone';

import CouponForm from '../../../components/forms/CouponForm';
import SearchForm from '../../../components/forms/SearchForm';

import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

moment.tz.setDefault('America/New_York');

const CreateCoupon = () => {
  const [name, setName] = useState('');
  const [discount, setDiscount] = useState('');
  const [expiration, setExpiration] = useState('');
  const [coupons, setCoupons] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const {
    user: { token }
  } = useSelector((state) => ({ ...state }));

  const unmounted = useRef(false);

  useEffect(() => {
    return () => {
      unmounted.current = true;
    };
  }, []);

  const loadCoupons = () => {
    getAllCoupons()
      .then((coupons) => {
        if (!unmounted.current) {
          setCoupons(coupons.data);
        }
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(name, discount, expiration);

    createCoupon({ name, discount, expiration }, token)
      .then((res) => {
        if (!unmounted.current) {
          setName('');
          setDiscount('');
          setExpiration('');
        }

        loadCoupons();

        toast.success(`${res.data.name} coupon has been created.`);
      })
      .catch((error) => {
        toast.error(error.response.data);
      });
  };

  const handleDelete = (name, couponId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `You will not be able to recover the ${name} coupon!`,
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it.'
    }).then((result) => {
      if (result.value) {
        deleteCoupon(couponId, token)
          .then((res) => {
            loadCoupons();

            toast.success(`${res.data.name} coupon has been removed.`);
          })
          .catch((error) => {
            toast.error(error.response.data);
          });
      }
    });
  };

  const foundCoupons = (searchQuery) => (coupon) => {
    return coupon.name.toLowerCase().includes(searchQuery);
  };

  return (
    <div className="container mt-4">
      <h3 className="text-primary">Create Coupon</h3>
      <CouponForm
        name={name}
        setName={setName}
        discount={discount}
        setDiscount={setDiscount}
        expiration={expiration}
        setExpiration={setExpiration}
        handleSubmit={handleSubmit}
        method="Create"
      />
      <hr />
      <SearchForm searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <table className="table table-bordered">
        <thead className="thead-light">
          <tr>
            <th scope="col">Coupon Name</th>
            <th scope="col">Discount %</th>
            <th scope="col">Expiration Date</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {coupons.filter(foundCoupons(searchQuery)).map((coupon) => (
            <tr key={coupon._id}>
              <td>{coupon.name}</td>
              <td>{coupon.discount}%</td>
              <td>
                {moment(coupon.expiration).format('MM/DD/YYYY @ hh:mm a z')}
              </td>
              <td>
                <Link to={`/admin/coupon/${coupon.name}`}>
                  <span className="btn btn-sm text-warning">
                    <EditOutlined />
                  </span>
                </Link>
                <span
                  onClick={() => handleDelete(coupon.name, coupon._id)}
                  className="btn btn-sm text-danger"
                >
                  <DeleteOutlined />
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CreateCoupon;
