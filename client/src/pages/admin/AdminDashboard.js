import React, { useState, useEffect } from 'react';
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
import { getProductsBySoldValue } from '../../api/product';
import { getOrdersByDate } from '../../api/order';

import AdminNav from '../../components/nav/AdminNav';

import { Tabs, Select } from 'antd';
const { TabPane } = Tabs;
const { Option } = Select;

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [date, setDate] = useState('Overall');
  const [sort, setSort] = useState('Total Price - High to Low');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    getProductsBySoldValue(date, sort).then((res) => {
      setProducts(res.data);
      setLoading(false);
    });

    getOrdersByDate(date).then((res) => {
      setOrders(res.data);
      setLoading(false);
    });
  }, [date, sort]);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col-md-10">
          <h4>Admin Dashboard</h4>
          <hr />
          <Tabs defaultActiveKey="1" type="card" size="large">
            <TabPane tab="Products" key="Products">
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
                    <Option value="Total Price - High to Low">
                      Total Price - High to Low
                    </Option>
                    <Option value="Total Price - Low to High">
                      Total Price - Low to High
                    </Option>
                    <Option value="Number Sold - High to Low">
                      Number Sold - High to Low
                    </Option>
                    <Option value="Number Sold - Low to High">
                      Number Sold - Low to High
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
                      return name === 'total'
                        ? `$${new Intl.NumberFormat('en').format(value)}`
                        : value;
                    }}
                  />
                  <Legend />
                  <Bar yAxisId="left" dataKey="sold" fill="#8884d8" />
                  <Bar yAxisId="right" dataKey="total" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </TabPane>
            <TabPane tab="Orders" key="Orders">
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
                  <XAxis dataKey="name" />
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
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
