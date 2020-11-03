const Order = require('../models/order');
const User = require('../models/user');
const Product = require('../models/product');
const { setQueryAndSort, setOrdersByDate } = require('../helpers/order');

// create
exports.createOrder = async (req, res) => {
  try {
    const { cart, address, paymentIntent } = req.body;

    const foundUser = await User.findOne({ email: req.user.email }).exec();

    const { _id } = await new Order({
      products: cart,
      paymentIntent: paymentIntent.paymentIntent,
      orderedBy: foundUser._id,
      address
    }).save();

    const updatedUser = await User.findOneAndUpdate(
      {
        email: req.user.email
      },
      { $push: { orders: { _id } }, $set: { cart: [] } },
      { new: true }
    )
      .populate({
        path: 'orders',
        populate: {
          path: 'products.product'
        }
      })
      .select('-cart -__v -createdAt -updatedAt')
      .exec();

    const bulkOption = cart.map((item) => {
      return {
        updateOne: {
          filter: { _id: item.product._id },
          update: { $inc: { quantity: -item.quantity, sold: +item.quantity } }
        }
      };
    });

    await Product.bulkWrite(bulkOption, {
      new: true,
      timestamps: false
    });

    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// read
exports.listOrders = async (_, res) => {
  try {
    const orders = await Order.find()
      .sort('-createdAt')
      .populate('products.product')
      .exec();

    res.json(orders);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.listNewOrders = async (req, res) => {
  try {
    const { lastLogin } = req.body;

    const orders = await Order.find({ createdAt: { $gte: lastLogin } })
      .sort('-createdAt')
      .populate('products.product')
      .exec();

    res.json(orders);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getOrdersByDate = async (req, res) => {
  try {
    const { date } = req.body;

    const query = setQueryAndSort(date).query;
    const sort = setQueryAndSort(date).sort;

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

    const ordersByDate = setOrdersByDate(date, orders);

    res.json(ordersByDate);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// update
exports.updateOrder = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const { orderId } = req.params;

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus },
      { new: true }
    );

    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
