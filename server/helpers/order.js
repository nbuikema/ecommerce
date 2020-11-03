const moment = require('moment-timezone');

exports.setQueryAndSort = (date) => {
  let query, sort;

  switch (date) {
    case 'Overall':
      query = { orderedYear: { $gte: 0 } };
      sort = { orderedYear: 1 };
      break;
    case 'This Year':
      query = { orderedYear: { $eq: new Date().getFullYear() } };
      sort = { orderedMonth: 1 };
      break;
    case 'This Month':
      query = {
        orderedMonth: { $eq: new Date().getMonth() + 1 },
        orderedYear: { $eq: new Date().getFullYear() }
      };
      sort = { orderedDayOfMonth: 1 };
      break;
    case 'This Week':
      query = {
        orderedWeek: { $eq: moment(new Date()).week() - 1 },
        orderedYear: { $eq: new Date().getFullYear() }
      };
      sort = { orderedDayOfWeek: 1 };
      break;
    case 'Today':
      query = {
        orderedYear: { $eq: new Date().getFullYear() },
        orderedMonth: { $eq: new Date().getMonth() + 1 },
        orderedDayOfMonth: { $eq: new Date().getDate() }
      };
      sort = { orderedDayOfMonth: 1 };
      break;
  }

  return { query, sort };
};

exports.setOrdersByDate = (date, orders) => {
  let ordersByDate = [];

  switch (date) {
    case 'This Year':
      ordersByDate = [
        { dateGroup: 'January', orders: 0, average: 0, sales: 0 },
        { dateGroup: 'February', orders: 0, average: 0, sales: 0 },
        { dateGroup: 'March', orders: 0, average: 0, sales: 0 },
        { dateGroup: 'April', orders: 0, average: 0, sales: 0 },
        { dateGroup: 'May', orders: 0, average: 0, sales: 0 },
        { dateGroup: 'June', orders: 0, average: 0, sales: 0 },
        { dateGroup: 'July', orders: 0, average: 0, sales: 0 },
        { dateGroup: 'August', orders: 0, average: 0, sales: 0 },
        { dateGroup: 'September', orders: 0, average: 0, sales: 0 },
        { dateGroup: 'October', orders: 0, average: 0, sales: 0 },
        { dateGroup: 'November', orders: 0, average: 0, sales: 0 },
        { dateGroup: 'December', orders: 0, average: 0, sales: 0 }
      ];
      break;
    case 'This Month':
      ordersByDate = [
        {
          dateGroup: `${orders[0].orderedMonth}/1 - ${orders[0].orderedMonth}/7`,
          orders: 0,
          average: 0,
          sales: 0
        },
        {
          dateGroup: `${orders[0].orderedMonth}/8 - ${orders[0].orderedMonth}/14`,
          orders: 0,
          average: 0,
          sales: 0
        },
        {
          dateGroup: `${orders[0].orderedMonth}/15 - ${orders[0].orderedMonth}/21`,
          orders: 0,
          average: 0,
          sales: 0
        },
        {
          dateGroup: `${orders[0].orderedMonth}/22 - ${orders[0].orderedMonth}/28`,
          orders: 0,
          average: 0,
          sales: 0
        },
        {
          dateGroup: `${orders[0].orderedMonth}/29 - ${orders[0].orderedMonth}/31`,
          orders: 0,
          average: 0,
          sales: 0
        }
      ];
      break;
    case 'This Week':
      ordersByDate = [
        { dateGroup: 'Sunday', orders: 0, average: 0, sales: 0 },
        { dateGroup: 'Monday', orders: 0, average: 0, sales: 0 },
        { dateGroup: 'Tuesday', orders: 0, average: 0, sales: 0 },
        { dateGroup: 'Wednesday', orders: 0, average: 0, sales: 0 },
        { dateGroup: 'Thursday', orders: 0, average: 0, sales: 0 },
        { dateGroup: 'Friday', orders: 0, average: 0, sales: 0 },
        { dateGroup: 'Saturday', orders: 0, average: 0, sales: 0 }
      ];
      break;
    case 'Today':
      ordersByDate = [
        { dateGroup: '12 am - 4 am UTC', orders: 0, average: 0, sales: 0 },
        { dateGroup: '4 am - 8 am UTC', orders: 0, average: 0, sales: 0 },
        { dateGroup: '8 am - 12 pm UTC', orders: 0, average: 0, sales: 0 },
        { dateGroup: '12 pm - 4 pm UTC', orders: 0, average: 0, sales: 0 },
        { dateGroup: '4 pm - 8 pm UTC', orders: 0, average: 0, sales: 0 },
        { dateGroup: '8 pm - 12 am UTC', orders: 0, average: 0, sales: 0 }
      ];
      break;
  }

  orders.forEach((order) => {
    let dateGroup = '';
    let orders = 0;
    let index;

    switch (date) {
      case 'Overall':
        index = ordersByDate.findIndex(
          (x) => x.dateGroup === order.orderedYear
        );

        if (index > -1) {
          ordersByDate[index].orders++;
          ordersByDate[index].sales += order.paymentIntent.amount / 100;
        } else {
          dateGroup = order.orderedYear;
          orders = 1;
          sales = order.paymentIntent.amount / 100;

          ordersByDate.push({ dateGroup, orders, sales });
        }
        break;
      case 'This Year':
        index = ordersByDate.findIndex(
          (x) => x.dateGroup === moment(order.orderedMonth, 'MM').format('MMMM')
        );

        ordersByDate[index].orders++;
        ordersByDate[index].sales += order.paymentIntent.amount / 100;
        break;
      case 'This Month':
        index = ordersByDate.findIndex((x) => {
          let search = '';

          if (order.orderedDayOfMonth <= 7) {
            search = `${order.orderedMonth}/1 - ${order.orderedMonth}/7`;
          } else if (
            order.orderedDayOfMonth >= 8 &&
            order.orderedDayOfMonth <= 14
          ) {
            search = `${order.orderedMonth}/8 - ${order.orderedMonth}/14`;
          } else if (
            order.orderedDayOfMonth >= 15 &&
            order.orderedDayOfMonth <= 21
          ) {
            search = `${order.orderedMonth}/15 - ${order.orderedMonth}/21`;
          } else if (
            order.orderedDayOfMonth >= 22 &&
            order.orderedDayOfMonth <= 28
          ) {
            search = `${order.orderedMonth}/1 - ${order.orderedMonth}/8`;
          } else if (order.orderedDayOfMonth >= 29) {
            search = `${order.orderedMonth}/29 - ${order.orderedMonth + 1}/1`;
          }

          return x.dateGroup === search;
        });

        ordersByDate[index].orders++;
        ordersByDate[index].sales += order.paymentIntent.amount / 100;
        break;
      case 'This Week':
        index = ordersByDate.findIndex(
          (x) =>
            x.dateGroup ===
            moment(order.orderedDayOfWeek - 1, 'e').format('dddd')
        );

        ordersByDate[index].orders++;
        ordersByDate[index].sales += order.paymentIntent.amount / 100;
        break;
      case 'Today':
        if (order.orderedHour >= 0 && order.orderedHour <= 3) {
          ordersByDate[0].orders++;
          ordersByDate[0].sales += order.paymentIntent.amount / 100;
        } else if (order.orderedHour >= 4 && order.orderedHour <= 7) {
          ordersByDate[1].orders++;
          ordersByDate[1].sales += order.paymentIntent.amount / 100;
        } else if (order.orderedHour >= 8 && order.orderedHour <= 11) {
          ordersByDate[2].orders++;
          ordersByDate[2].sales += order.paymentIntent.amount / 100;
        } else if (order.orderedHour >= 12 && order.orderedHour <= 15) {
          ordersByDate[3].orders++;
          ordersByDate[3].sales += order.paymentIntent.amount / 100;
        } else if (order.orderedHour >= 16 && order.orderedHour <= 19) {
          ordersByDate[4].orders++;
          ordersByDate[4].sales += order.paymentIntent.amount / 100;
        } else if (order.orderedHour >= 20 && order.orderedHour <= 23) {
          ordersByDate[5].orders++;
          ordersByDate[5].sales += order.paymentIntent.amount / 100;
        }
        break;
    }
  });

  ordersByDate.forEach((section) => {
    if (section.sales > 0) {
      section.average = parseFloat((section.sales / section.orders).toFixed(2));
      section.sales = parseFloat(section.sales.toFixed(2));
    }
  });

  return ordersByDate;
};
