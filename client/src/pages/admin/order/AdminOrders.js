import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getAllOrders, updateOrder } from '../../../api/order';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import moment from 'moment';

import ImageModal from '../../../components/modals/ImageModal';

import { Select } from 'antd';
const { Option } = Select;

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  const {
    user: { token }
  } = useSelector((state) => ({ ...state }));

  const unmounted = useRef(false);

  useEffect(() => {
    return () => {
      unmounted.current = true;
    };
  }, []);

  const memoizedloadOrders = useCallback(() => {
    getAllOrders(token)
      .then((res) => {
        if (!unmounted.current) {
          setOrders(res.data);
        }
      })
      .catch((error) => {
        toast.error(error.message);
      });
  }, [token]);

  useEffect(() => {
    memoizedloadOrders();
  }, [memoizedloadOrders]);

  const handleUpdateOrder = (value, order) => {
    updateOrder(token, order._id, value)
      .then((res) => {
        memoizedloadOrders();

        toast.success(
          `Order ${res.data._id} status updated to '${res.data.orderStatus}'`
        );
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  return (
    <div className="container mt-4">
      <h3 className="text-primary">Orders</h3>
      {orders.map((order, index) => (
        <div key={index} className="m-5 p-3 card">
          <h5>Order ID: {order._id}</h5>
          <h6>Order Details</h6>
          <table className="table table-bordered">
            <thead className="thead-light">
              <tr>
                <th scope="col">Status</th>
                <th scope="col">Placed</th>
                <th scope="col">Last Updated</th>
                <th scope="col">Delivery Address</th>
                <th scope="col">Total Paid</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <h4>
                    <Select
                      defaultValue={order.orderStatus}
                      onChange={(value) => handleUpdateOrder(value, order)}
                      size="large"
                    >
                      <Option value="Received">Received</Option>
                      <Option value="Processing">Processing</Option>
                      <Option value="Shipped">Shipped</Option>
                      <Option value="Delivered">Delivered</Option>
                      <Option value="Completed">Completed</Option>
                      <Option value="Cancelled">Cancelled</Option>
                      <Option value="Delayed">Delayed</Option>
                    </Select>
                  </h4>
                </td>
                <td>
                  {moment(order.createdAt).format('MM/DD/YYYY @ hh:mm a z')}
                </td>
                <td>
                  {moment(order.updatedAt).format('MM/DD/YYYY @ hh:mm a z')}
                </td>
                <td>
                  {order.address.address},{' '}
                  {order.address.secondaryType !== 'None' &&
                    order.address.secondaryType +
                      ' ' +
                      order.address.secondaryAddress +
                      ', '}
                  {order.address.city}, {order.address.state},{' '}
                  {order.address.zip}
                </td>
                <td>${order.paymentIntent.amount / 100}</td>
              </tr>
            </tbody>
          </table>
          <h6>Products</h6>
          <table className="table table-bordered">
            <thead className="thead-light">
              <tr>
                <th scope="col">Image</th>
                <th scope="col">Title</th>
                <th scope="col">Price</th>
                <th scope="col">Quantity</th>
                <th scope="col">Total Price</th>
              </tr>
            </thead>
            <tbody>
              {orders[index].products.map((item, index) => (
                <tr key={index}>
                  <td className="text-center">
                    {item.product.images.length ? (
                      <ImageModal
                        title={item.product.title}
                        images={item.product.images}
                      />
                    ) : (
                      ''
                    )}
                  </td>
                  <td>{item.product.title}</td>
                  <td>${item.product.price}</td>
                  <td>{item.quantity}</td>
                  <td>${item.product.price * item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default AdminOrders;
