const Order = require('../models/order');
const moment = require('moment');

// read
exports.listOrders = async (_, res) => {
  const orders = await Order.find()
    .sort('-createdAt')
    .populate('products.product')
    .exec();

  res.json(orders);
};

exports.getOrdersByDate = async (req, res) => {
  const { date } = req.body;

  let query, sort;

  if (date === 'Overall') {
    query = { orderedYear: { $gte: 0 } };
    sort = { orderedYear: 1 };
  }
  if (date === 'This Year') {
    query = { orderedYear: { $eq: new Date().getFullYear() } };
    sort = { orderedMonth: 1 };
  }
  if (date === 'This Month') {
    query = { orderedMonth: { $eq: new Date().getMonth() + 1 } };
    sort = { orderedDayOfMonth: 1 };
  }
  if (date === 'This Week') {
    query = { orderedWeek: { $eq: moment(new Date()).week() - 1 } };
    sort = { orderedDayOfWeek: 1 };
  }
  if (date === 'Today') {
    query = {
      orderedYear: { $eq: new Date().getFullYear() },
      orderedMonth: { $eq: new Date().getMonth() + 1 },
      orderedDayOfMonth: { $eq: new Date().getDate() }
    };
    sort = { orderedDayOfMonth: 1 };
  }

  const orders = await Order.aggregate([
    {
      $addFields: {
        orderedMonth: { $month: '$createdAt' },
        orderedDayOfMonth: { $dayOfMonth: '$createdAt' },
        orderedYear: { $year: '$createdAt' },
        orderedWeek: { $week: '$createdAt' },
        orderedDayOfWeek: { $dayOfWeek: '$createdAt' }
      }
    },
    { $match: query },
    { $sort: sort }
  ]);

  let ordersByDate = [];

  orders.forEach((order) => {
    let dateGroup = '';
    let numOrders = 0;

    if (date === 'Overall') {
      const existsIndex = ordersByDate.findIndex(
        (x) => x.dateGroup === order.orderedYear
      );

      if (existsIndex > -1) {
        ordersByDate[existsIndex].numOrders++;
      } else {
        dateGroup = order.orderedYear;
        numOrders = 1;

        ordersByDate.push({ dateGroup, numOrders });
      }
    }

    if (date === 'This Year') {
      const existsIndex = ordersByDate.findIndex(
        (x) => x.dateGroup === moment(order.orderedMonth, 'MM').format('MMMM')
      );

      if (existsIndex > -1) {
        ordersByDate[existsIndex].numOrders++;
      } else {
        dateGroup = moment(order.orderedMonth, 'MM').format('MMMM');
        numOrders = 1;

        ordersByDate.push({ dateGroup, numOrders });
      }
    }

    if (date === 'This Month') {
      const existsIndex = ordersByDate.findIndex((x) => {
        let search = '';

        if (order.orderedDayOfMonth <= 7) {
          search = `${order.orderedMonth}/1 - ${order.orderedMonth}/7`;
        }
        if (order.orderedDayOfMonth >= 8 && order.orderedDayOfMonth <= 14) {
          search = `${order.orderedMonth}/8 - ${order.orderedMonth}/14`;
        }
        if (order.orderedDayOfMonth >= 15 && order.orderedDayOfMonth <= 21) {
          search = `${order.orderedMonth}/15 - ${order.orderedMonth}/21`;
        }
        if (order.orderedDayOfMonth >= 22 && order.orderedDayOfMonth <= 28) {
          search = `${order.orderedMonth}/1 - ${order.orderedMonth}/8`;
        }
        if (order.orderedDayOfMonth >= 29) {
          search = `${order.orderedMonth}/29 - ${order.orderedMonth + 1}/1`;
        }

        return x.dateGroup === search;
      });

      if (existsIndex > -1) {
        ordersByDate[existsIndex].numOrders++;
      } else {
        if (order.orderedDayOfMonth <= 7) {
          dateGroup = `${order.orderedMonth}/1 - ${order.orderedMonth}/7`;
        }
        if (order.orderedDayOfMonth >= 8 && order.orderedDayOfMonth <= 14) {
          dateGroup = `${order.orderedMonth}/8 - ${order.orderedMonth}/14`;
        }
        if (order.orderedDayOfMonth >= 15 && order.orderedDayOfMonth <= 21) {
          dateGroup = `${order.orderedMonth}/15 - ${order.orderedMonth}/21`;
        }
        if (order.orderedDayOfMonth >= 22 && order.orderedDayOfMonth <= 28) {
          dateGroup = `${order.orderedMonth}/1 - ${order.orderedMonth}/8`;
        }
        if (order.orderedDayOfMonth >= 29) {
          dateGroup = `${order.orderedMonth}/29 - ${order.orderedMonth + 1}/1`;
        }
        numOrders = 1;

        ordersByDate.push({ dateGroup, numOrders });
      }
    }

    if (date === 'This Week') {
      const existsIndex = ordersByDate.findIndex(
        (x) =>
          x.dateGroup === moment(order.orderedDayOfWeek - 1, 'E').format('dddd')
      );

      if (existsIndex > -1) {
        ordersByDate[existsIndex].numOrders++;
      } else {
        dateGroup = moment(order.orderedDayOfWeek - 1, 'E').format('dddd');
        numOrders = 1;

        ordersByDate.push({ dateGroup, numOrders });
      }
    }
  });

  if (date === 'Today') {
    ordersByDate.push({ dateGroup: 'Today', numOrders: orders.length });
  }

  res.json(ordersByDate);
};

// update
exports.updateOrder = async (req, res) => {
  const { orderStatus } = req.body;
  const { orderId } = req.params;

  const updatedOrder = await Order.findByIdAndUpdate(
    orderId,
    { orderStatus },
    { new: true }
  );

  res.json(updatedOrder);
};
