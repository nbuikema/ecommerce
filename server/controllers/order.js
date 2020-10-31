const Order = require('../models/order');

// read
exports.listOrders = async (_, res) => {
  const orders = await Order.find()
    .sort('-createdAt')
    .populate('products.product')
    .exec();

  res.json(orders);
};

exports.getOrdersByDate = async (req, res) => {
  const {
    date: { year, month, day }
  } = req.body;

  const orders = await Order.find({
    createdAt: { $gte: new Date(year, month, day) }
  })
    .select('createdAt paymentIntent.amount')
    .exec();

  let ordersByDate = [];

  orders.forEach((order) => {
    let date = '';
    let orders = 0;

    const existsIndex = ordersByDate.findIndex(
      (x) =>
        x.date ===
        `${
          order.createdAt.getMonth() + 1
        }/${order.createdAt.getDate()}/${order.createdAt.getFullYear()}`
    );

    if (existsIndex > -1) {
      ordersByDate[existsIndex].orders++;
    } else {
      date = `${
        order.createdAt.getMonth() + 1
      }/${order.createdAt.getDate()}/${order.createdAt.getFullYear()}`;
      orders = 1;

      ordersByDate.push({ date, orders });
    }
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
