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
  const [date, setDate] = useState('Overall');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    getProductsBySoldValue(date).then((res) => {
      setProducts(res.data);
      setLoading(false);
    });

    getOrdersByDate(date).then((res) => {
      setOrders(res.data);
      setLoading(false);
    });
  }, [date]);

  const handleChangeDate = (value) => {
    setDate(value);
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
                    value={date}
                    style={{ width: 120 }}
                    onChange={handleChangeDate}
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
                    value={date}
                    style={{ width: 120 }}
                    onChange={handleChangeDate}
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
              <BarChart width={500} height={300} data={orders}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dateGroup" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="numOrders" fill="#8884d8" />
              </BarChart>
              <AreaChart width={500} height={400} data={orders}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dateGroup" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="numOrders"
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
