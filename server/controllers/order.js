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
    query = {
      orderedMonth: { $eq: new Date().getMonth() + 1 },
      orderedYear: { $eq: new Date().getFullYear() }
    };
    sort = { orderedDayOfMonth: 1 };
  }
  if (date === 'This Week') {
    query = {
      orderedWeek: { $eq: moment(new Date()).week() - 1 },
      orderedYear: { $eq: new Date().getFullYear() }
    };
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
        orderedDayOfWeek: { $dayOfWeek: '$createdAt' },
        orderedHour: { $hour: '$createdAt' }
      }
    },
    { $match: query },
    { $sort: sort }
  ]);

  let ordersByDate = [];

  if (date === 'This Year') {
    ordersByDate = [
      { dateGroup: 'January', orders: 0, average: 0 },
      { dateGroup: 'February', orders: 0, average: 0 },
      { dateGroup: 'March', orders: 0, average: 0 },
      { dateGroup: 'April', orders: 0, average: 0 },
      { dateGroup: 'May', orders: 0, average: 0 },
      { dateGroup: 'June', orders: 0, average: 0 },
      { dateGroup: 'July', orders: 0, average: 0 },
      { dateGroup: 'August', orders: 0, average: 0 },
      { dateGroup: 'September', orders: 0, average: 0 },
      { dateGroup: 'October', orders: 0, average: 0 },
      { dateGroup: 'November', orders: 0, average: 0 },
      { dateGroup: 'December', orders: 0, average: 0 }
    ];
  }

  if (date === 'This Month') {
    ordersByDate = [
      {
        dateGroup: `${orders[0].orderedMonth}/1 - ${orders[0].orderedMonth}/7`,
        orders: 0,
        average: 0
      },
      {
        dateGroup: `${orders[0].orderedMonth}/8 - ${orders[0].orderedMonth}/14`,
        orders: 0,
        average: 0
      },
      {
        dateGroup: `${orders[0].orderedMonth}/15 - ${orders[0].orderedMonth}/21`,
        orders: 0,
        average: 0
      },
      {
        dateGroup: `${orders[0].orderedMonth}/22 - ${orders[0].orderedMonth}/28`,
        orders: 0,
        average: 0
      },
      {
        dateGroup: `${orders[0].orderedMonth}/29 - ${orders[0].orderedMonth}/31`,
        orders: 0,
        average: 0
      }
    ];
  }

  if (date === 'This Week') {
    ordersByDate = [
      { dateGroup: 'Sunday', orders: 0, average: 0 },
      { dateGroup: 'Monday', orders: 0, average: 0 },
      { dateGroup: 'Tuesday', orders: 0, average: 0 },
      { dateGroup: 'Wednesday', orders: 0, average: 0 },
      { dateGroup: 'Thursday', orders: 0, average: 0 },
      { dateGroup: 'Friday', orders: 0, average: 0 },
      { dateGroup: 'Saturday', orders: 0, average: 0 }
    ];
  }

  if (date === 'Today') {
    ordersByDate = [
      { dateGroup: '12 am - 4 am EST', orders: 0, average: 0 },
      { dateGroup: '4 am - 8 am EST', orders: 0, average: 0 },
      { dateGroup: '8 am - 12 pm EST', orders: 0, average: 0 },
      { dateGroup: '12 pm - 4 pm EST', orders: 0, average: 0 },
      { dateGroup: '4 pm - 8 pm EST', orders: 0, average: 0 },
      { dateGroup: '8 pm - 12 am EST', orders: 0, average: 0 }
    ];
  }

  orders.forEach((order) => {
    let dateGroup = '';
    let orders = 0;
    let average = 0;

    if (date === 'Overall') {
      const existsIndex = ordersByDate.findIndex(
        (x) => x.dateGroup === order.orderedYear
      );

      if (existsIndex > -1) {
        ordersByDate[existsIndex].orders++;
        ordersByDate[existsIndex].average += order.paymentIntent.amount / 100;
      } else {
        dateGroup = order.orderedYear;
        orders = 1;
        average = order.paymentIntent.amount / 100;

        ordersByDate.push({ dateGroup, orders, average });
      }
    }

    if (date === 'This Year') {
      const index = ordersByDate.findIndex(
        (x) => x.dateGroup === moment(order.orderedMonth, 'MM').format('MMMM')
      );

      ordersByDate[index].orders++;
      ordersByDate[index].average += order.paymentIntent.amount / 100;
    }

    if (date === 'This Month') {
      const exists = ordersByDate.findIndex((x) => {
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

      ordersByDate[exists].orders++;
      ordersByDate[exists].average += order.paymentIntent.amount / 100;
    }

    if (date === 'This Week') {
      const exists = ordersByDate.findIndex(
        (x) =>
          x.dateGroup === moment(order.orderedDayOfWeek - 2, 'e').format('dddd')
      );

      ordersByDate[exists].orders++;
      ordersByDate[exists].average += order.paymentIntent.amount / 100;
    }

    if (date === 'Today') {
      if (order.orderedHour - 5 >= 0 && order.orderedHour - 5 <= 3) {
        ordersByDate[0].orders++;
        ordersByDate[0].average += order.paymentIntent.amount / 100;
      }
      if (order.orderedHour - 5 >= 4 && order.orderedHour - 5 <= 7) {
        ordersByDate[1].orders++;
        ordersByDate[1].average += order.paymentIntent.amount / 100;
      }
      if (order.orderedHour - 5 >= 8 && order.orderedHour - 5 <= 11) {
        ordersByDate[2].orders++;
        ordersByDate[2].average += order.paymentIntent.amount / 100;
      }
      if (order.orderedHour - 5 >= 12 && order.orderedHour - 5 <= 15) {
        ordersByDate[3].orders++;
        ordersByDate[3].average += order.paymentIntent.amount / 100;
      }
      if (order.orderedHour - 5 >= 16 && order.orderedHour - 5 <= 19) {
        ordersByDate[4].orders++;
        ordersByDate[4].average += order.paymentIntent.amount / 100;
      }
      if (order.orderedHour - 5 >= 20 && order.orderedHour - 5 <= 23) {
        ordersByDate[5].orders++;
        ordersByDate[5].average += order.paymentIntent.amount / 100;
      }
    }
  });

  ordersByDate.forEach((section) => {
    section.average === 0
      ? 0
      : (section.average = parseFloat(
          (section.average / section.orders).toFixed(2)
        ));
  });

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
