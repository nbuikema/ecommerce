import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import {
  BarChart,
  CartesianGrid,
  Tooltip,
  Bar,
  XAxis,
  YAxis,
  Legend,
  AreaChart,
  Area,
  ResponsiveContainer
} from 'recharts';
import {
  getProductsByDate,
  getProductsByInventory
} from '../../../api/product';
import { getOrdersByDate, getNewOrders, updateOrder } from '../../../api/order';
import { toast } from 'react-toastify';
import moment from 'moment';

import ImageModal from '../../../components/modals/ImageModal';

import { Tabs, Select } from 'antd';
const { TabPane } = Tabs;
const { Option } = Select;

const AdminDashboard = () => {
  const [newOrders, setNewOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [date, setDate] = useState('Overall');
  const [sort, setSort] = useState('Gross Sales - High to Low');
  const [inventorySort, setInventorySort] = useState('asc');
  const [tab, setTab] = useState('Gross Sales');
  const [loading, setLoading] = useState(true);

  const {
    user: { lastLogin, token }
  } = useSelector((state) => ({ ...state }));

  const unmounted = useRef(false);

  useEffect(() => {
    return () => {
      unmounted.current = true;
    };
  }, []);

  const memoizedloadOrders = useCallback(() => {
    getNewOrders(token, lastLogin)
      .then((res) => {
        if (!unmounted.current) {
          setNewOrders(res.data);
        }
      })
      .catch((error) => {
        toast.error(error.message);
      });
  }, [token, lastLogin]);

  useEffect(() => {
    memoizedloadOrders();
  }, [memoizedloadOrders]);

  useEffect(() => {
    (tab === 'Gross Sales' || tab === 'Orders Sold') &&
      getOrdersByDate(token, date)
        .then((res) => {
          if (!unmounted.current) {
            setOrders(res.data);
            setLoading(false);
          }
        })
        .catch((error) => {
          toast.error(error.message);
        });

    tab === 'Inventory' &&
      getProductsByInventory(token, inventorySort)
        .then((res) => {
          if (!unmounted.current) {
            setInventory(res.data);
            setLoading(false);
          }
        })
        .catch((error) => {
          toast.error(error.message);
        });

    tab === 'Products Sold' &&
      getProductsByDate(token, date, sort)
        .then((res) => {
          if (!unmounted.current) {
            setProducts(res.data);
            setLoading(false);
          }
        })
        .catch((error) => {
          toast.error(error.message);
        });
  }, [tab, date, sort, inventorySort, token]);

  const handleTabChange = (key) => {
    if (key !== tab) {
      setProducts([]);
      setOrders([]);
      setInventory([]);
      setDate('Overall');
      setSort('Gross Sales - High to Low');
      setInventorySort('asc');
      setLoading(true);
      setTab(key);
    }
  };

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
      <h3 className="text-primary">Admin Dashboard</h3>
      <hr />
      <Tabs defaultActiveKey="Welcome Back" type="card" size="large">
        <TabPane tab="Welcome Back" key="Welcome Back">
          <h4>Orders Since Your Last Login</h4>
          {newOrders.map((order, index) => (
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
                  {newOrders[index].products.map((item, index) => (
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
        </TabPane>
        <TabPane tab="Analytics" key="Analytics">
          <Tabs
            activeKey={tab}
            type="card"
            size="large"
            onChange={handleTabChange}
            tabPosition="left"
          >
            <TabPane tab="Gross Sales" key="Gross Sales">
              <h5>
                Income
                <span>
                  <Select
                    value={date}
                    style={{ width: 120 }}
                    onChange={(value) => setDate(value)}
                    className="mx-3"
                    disabled={loading}
                  >
                    <Option value="Overall">Overall</Option>
                    <Option value="This Year">This Year</Option>
                    <Option value="This Month">This Month</Option>
                    <Option value="This Week">This Week</Option>
                    <Option value="Today">Today</Option>
                  </Select>
                </span>
              </h5>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={orders}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="dateGroup" />
                  <YAxis yAxisId="left" orientation="left" stroke="#82ca9d" />
                  <Tooltip
                    formatter={(value) =>
                      `$${new Intl.NumberFormat('en').format(value)}`
                    }
                  />
                  <Legend />
                  <Bar yAxisId="left" dataKey="sales" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={orders}>
                  <defs>
                    <linearGradient id="sales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="dateGroup" />
                  <YAxis yAxisId="left" orientation="left" stroke="#82ca9d" />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip
                    formatter={(value) =>
                      `$${new Intl.NumberFormat('en').format(value)}`
                    }
                  />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke="#82ca9d"
                    fillOpacity={1}
                    fill="url(#sales)"
                    yAxisId="left"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </TabPane>
            <TabPane tab="Inventory" key="Inventory">
              <h5>
                Inventory
                <span>
                  <Select
                    value={inventorySort}
                    style={{ width: 240 }}
                    onChange={(value) => setInventorySort(value)}
                    className="mx-3"
                    disabled={loading}
                  >
                    <Option value="asc">Low to High</Option>
                    <Option value="desc">High to Low</Option>
                  </Select>
                </span>
              </h5>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={inventory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="title" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="quantity" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </TabPane>
            <TabPane tab="Products Sold" key="Products Sold">
              <h5>
                Best Selling Products
                <span>
                  <Select
                    value={date}
                    style={{ width: 120 }}
                    onChange={(value) => setDate(value)}
                    className="mx-3"
                    disabled={loading}
                  >
                    <Option value="Overall">Overall</Option>
                    <Option value="This Year">This Year</Option>
                    <Option value="This Month">This Month</Option>
                    <Option value="This Week">This Week</Option>
                    <Option value="Today">Today</Option>
                  </Select>
                </span>
                Sort By
                <span>
                  <Select
                    value={sort}
                    style={{ width: 240 }}
                    onChange={(value) => setSort(value)}
                    className="mx-3"
                    disabled={loading}
                  >
                    <Option value="Gross Sales - High to Low">
                      Gross Sales - High to Low
                    </Option>
                    <Option value="Gross Sales - Low to High">
                      Gross Sales - Low to High
                    </Option>
                    <Option value="Quantity Sold - High to Low">
                      Quantity Sold - High to Low
                    </Option>
                    <Option value="Quantity Sold - Low to High">
                      Quantity Sold - Low to High
                    </Option>
                  </Select>
                </span>
              </h5>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={products}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="title" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip
                    formatter={(value, name) => {
                      return name === 'sales'
                        ? `$${new Intl.NumberFormat('en').format(value)}`
                        : value;
                    }}
                  />
                  <Legend />
                  <Bar yAxisId="left" dataKey="sold" fill="#8884d8" />
                  <Bar yAxisId="right" dataKey="sales" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </TabPane>
            <TabPane tab="Orders Sold" key="Orders Sold">
              <h5>
                Orders
                <span>
                  <Select
                    value={date}
                    style={{ width: 120 }}
                    onChange={(value) => setDate(value)}
                    className="mx-3"
                    disabled={loading}
                  >
                    <Option value="Overall">Overall</Option>
                    <Option value="This Year">This Year</Option>
                    <Option value="This Month">This Month</Option>
                    <Option value="This Week">This Week</Option>
                    <Option value="Today">Today</Option>
                  </Select>
                </span>
              </h5>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={orders}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="dateGroup" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip
                    formatter={(value, name) => {
                      return name === 'average'
                        ? `$${new Intl.NumberFormat('en').format(value)}`
                        : value;
                    }}
                  />
                  <Legend />
                  <Bar yAxisId="left" dataKey="orders" fill="#8884d8" />
                  <Bar yAxisId="right" dataKey="average" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={orders}>
                  <defs>
                    <linearGradient id="orders" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="average" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="dateGroup" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip
                    formatter={(value, name) => {
                      return name === 'average'
                        ? `$${new Intl.NumberFormat('en').format(value)}`
                        : value;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="orders"
                    stroke="#8884d8"
                    fillOpacity={1}
                    fill="url(#orders)"
                    yAxisId="left"
                  />
                  <Area
                    type="monotone"
                    dataKey="average"
                    stroke="#82ca9d"
                    fillOpacity={1}
                    fill="url(#average)"
                    yAxisId="right"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </TabPane>
          </Tabs>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
