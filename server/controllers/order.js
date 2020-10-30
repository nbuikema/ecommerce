const Order = require('../models/order');

// read
exports.listOrders = async (_, res) => {
  const orders = await Order.find()
    .sort('-createdAt')
    .populate('products.product')
    .exec();

  res.json(orders);
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
