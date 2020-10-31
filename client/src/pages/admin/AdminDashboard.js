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
  Area
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
  const [date, setDate] = useState({
    year: 0,
    month: 0,
    day: 0
  });
  const [dateSelect, setDateSelect] = useState('All Time');

  useEffect(() => {
    getProductsBySoldValue(date).then((res) => {
      setProducts(res.data);
    });

    getOrdersByDate(date).then((res) => {
      setOrders(res.data);
    });
  }, [date]);

  const handleChangeDate = (value) => {
    setDateSelect(value);

    switch (value) {
      case 'All Time':
        return setDate({
          year: 0,
          month: 0,
          day: 0
        });
      case 'Past Year':
        return setDate({
          year: new Date().getFullYear() - 1,
          month: new Date().getMonth(),
          day: new Date().getDate()
        });
      case 'Past Month':
        return setDate({
          year: new Date().getFullYear(),
          month: new Date().getMonth() - 1,
          day: new Date().getDate() - 1
        });
      case 'Past Week':
        return setDate({
          year: new Date().getFullYear(),
          month: new Date().getMonth(),
          day: new Date().getDate() - 7
        });
      case 'Today':
        return setDate({
          year: new Date().getFullYear(),
          month: new Date().getMonth(),
          day: new Date().getDate()
        });
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col">
          <h4>Admin Dashboard</h4>
          <hr />
          <Tabs defaultActiveKey="1" type="card" size="large">
            <TabPane tab="Products" key="Products">
              <h5>
                Best Selling Products
                <span>
                  <Select
                    value={dateSelect}
                    style={{ width: 120 }}
                    onChange={handleChangeDate}
                    className="mx-3"
                  >
                    <Option value="All Time">All Time</Option>
                    <Option value="Past Year">Past Year</Option>
                    <Option value="Past Month">Past Month</Option>
                    <Option value="Past Week">Past Week</Option>
                    <Option value="Today">Today</Option>
                  </Select>
                </span>
              </h5>
              <BarChart width={500} height={300} data={products}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="title" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="totalPrice" fill="#8884d8" />
                <Bar yAxisId="right" dataKey="quantitySold" fill="#82ca9d" />
              </BarChart>
            </TabPane>
            <TabPane tab="Orders" key="Orders">
              <h5>
                Orders
                <span>
                  <Select
                    value={dateSelect}
                    style={{ width: 120 }}
                    onChange={handleChangeDate}
                    className="mx-3"
                  >
                    <Option value="All Time">All Time</Option>
                    <Option value="Past Year">Past Year</Option>
                    <Option value="Past Month">Past Month</Option>
                    <Option value="Past Week">Past Week</Option>
                    <Option value="Today">Today</Option>
                  </Select>
                </span>
              </h5>
              <AreaChart width={500} height={400} data={orders}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="orders"
                  stroke="#8884d8"
                  fill="#8884d8"
                />
              </AreaChart>
            </TabPane>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
