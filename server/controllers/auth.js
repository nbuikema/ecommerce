const User = require('../models/user');
const Product = require('../models/product');

// create
exports.createOrUpdateUser = async (req, res) => {
  let { name, email } = req.user;

  if (!name) {
    name = email.split('@')[0];
  }

  const user = await User.findOneAndUpdate({ email }, { name }, { new: true });

  if (user) {
    return res.json(user);
  } else {
    const newUser = await new User({
      email,
      name
    }).save();

    return res.json(newUser);
  }
};

// read
exports.currentUser = async (req, res) => {
  await User.findOne({ email: req.user.email })
    .populate({ path: 'cart.product', model: Product })
    .populate('category')
    .populate('wishlist')
    .populate({
      path: 'orders',
      populate: {
        path: 'products.product'
      }
    })
    .exec(async (error, user) => {
      if (error) {
        throw new Error(error);
      }

      res.json(user);
    });

  await User.findOneAndUpdate(
    { email: req.user.email },
    { lastLogin: Date.now() },
    { new: true }
  );
};
