import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { PDFDownloadLink } from '@react-pdf/renderer';

import ImageModal from '../../components/modals/ImageModal';
import Invoice from '../../components/invoice/Invoice';

const Orders = () => {
  const [ready, setReady] = useState(false);

  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    setReady(true);
  }, []);

  const showDownloadLink = (order) => (
    <PDFDownloadLink
      document={<Invoice order={order} />}
      fileName="invoice.pdf"
      className="btn btn-sm btn-outline-primary"
    >
      Download Invoice
    </PDFDownloadLink>
  );

  return (
    <div className="container mt-4">
      <h3 className="text-primary">My Orders</h3>
      {user.orders.map((order, index) => (
        <div key={index} className="p-4 mb-4 card">
          <h5>
            Order ID: {order._id}
            <span className="float-right">
              {ready && showDownloadLink(order)}
            </span>
          </h5>
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
                <td
                  className={`bg-${
                    order.orderStatus === 'Received' ? 'light' : ''
                  }${order.orderStatus === 'Processing' ? 'secondary' : ''}${
                    order.orderStatus === 'Shipped' ? 'primary' : ''
                  }${order.orderStatus === 'Delivered' ? 'info' : ''}${
                    order.orderStatus === 'Completed' ? 'success' : ''
                  }${order.orderStatus === 'Cancelled' ? 'danger' : ''}${
                    order.orderStatus === 'Delayed' ? 'warning' : ''
                  }`}
                >
                  <h5
                    className={`m-0 ${
                      order.orderStatus === 'Received' ? '' : 'text-white'
                    }`}
                  >
                    {order.orderStatus}
                  </h5>
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
              {user.orders[index].products.map((item, index) => (
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

export default Orders;
