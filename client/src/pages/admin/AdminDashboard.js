import React, { useState, useEffect } from 'react';
import { BarChart, CartesianGrid, Tooltip, Bar, XAxis, YAxis } from 'recharts';
import { getProductsBySoldValue } from '../../api/product';

import AdminNav from '../../components/nav/AdminNav';

import { Tabs } from 'antd';
const { TabPane } = Tabs;

const AdminDashboard = () => {
  const [productsSoldValue, setProductsSoldValue] = useState([]);

  useEffect(() => {
    getProductsBySoldValue().then((res) => {
      let soldValue = [];

      res.data.forEach((product) => {
        soldValue.push({
          name: product.document.title,
          amount: product.soldValue
        });
      });

      setProductsSoldValue(soldValue);
    });
  }, []);

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
            <TabPane tab="Products" key="1">
              <h5>Best Selling Products (Overall)</h5>
              <BarChart width={730} height={250} data={productsSoldValue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#8884d8" />
              </BarChart>

              <h5>Best Selling Products (Past Week)</h5>
              <BarChart width={730} height={250} data={productsSoldValue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#8884d8" />
              </BarChart>

              <h5>Best Selling Products (Past Month)</h5>
              <BarChart width={730} height={250} data={productsSoldValue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#8884d8" />
              </BarChart>

              <h5>Best Selling Products (Past Year)</h5>
              <BarChart width={730} height={250} data={productsSoldValue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#8884d8" />
              </BarChart>
            </TabPane>
            <TabPane tab="Orders" key="2">
              <h5>Number of Orders (Overall)</h5>
              <BarChart width={730} height={250} data={productsSoldValue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#8884d8" />
              </BarChart>

              <h5>Number of Orders (Past Week)</h5>
              <BarChart width={730} height={250} data={productsSoldValue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#8884d8" />
              </BarChart>

              <h5>Number of Orders (Past Month)</h5>
              <BarChart width={730} height={250} data={productsSoldValue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#8884d8" />
              </BarChart>

              <h5>Number of Orders (Past Year)</h5>
              <BarChart width={730} height={250} data={productsSoldValue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#8884d8" />
              </BarChart>
            </TabPane>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
