const User = require('../models/user');
const Product = require('../models/product');

// create
exports.createOrUpdateUser = async (req, res) => {
  try {
    let { name, email } = req.user;

    if (!name) {
      name = email.split('@')[0];
    }

    const user = await User.findOneAndUpdate({ email }, { name }, { new: true })
      .populate('cart.product')
      .populate('category')
      .populate('wishlist')
      .populate({
        path: 'orders',
        populate: {
          path: 'products.product'
        }
      })
      .populate({
        path: 'orders',
        populate: {
          path: 'coupon'
        }
      })
      .exec();

    res.json(user);

    await User.findOneAndUpdate(
      { email },
      { lastLogin: Date.now() },
      { new: true, timestamps: false }
    );

    if (user) {
      return res.json(user);
    } else {
      const newUser = await new User({
        email,
        name,
        lastLogin: Date.now()
      }).save();

      return res.json(newUser);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// read
exports.currentUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email })
      .populate('cart.product')
      .populate('category')
      .populate('wishlist')
      .populate({
        path: 'orders',
        populate: {
          path: 'products.product'
        }
      })
      .populate({
        path: 'orders',
        populate: {
          path: 'coupon'
        }
      })
      .exec();

    res.json(user);

    await User.findOneAndUpdate(
      { email: req.user.email },
      { lastLogin: Date.now() },
      { new: true, timestamps: false }
    );
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
