const User = require('../models/user');
const Product = require('../models/product');
const mongoose = require('mongoose');

exports.updateCart = async (req, res) => {
  try {
    const { cart, cartItem } = req.body;

    if (cartItem) {
      let existsIndex = cart
        .map((item) => item.product._id)
        .indexOf(cartItem.product._id);

      if (existsIndex === -1) {
        cart.push(cartItem);
      }

      if (existsIndex > -1 && cartItem.quantity === 0) {
        cart.splice(existsIndex, 1);
      }

      cart.forEach((item) => {
        item.product = mongoose.Types.ObjectId(item.product._id);
      });
    } else {
      cart.splice(0, cart.length);
    }

    const updated = await User.findOneAndUpdate(
      {
        email: req.user.email
      },
      { cart },
      { new: true }
    ).exec();

    res.json(updated);
  } catch (error) {
    res.status(400).send('Could not update cart.');
  }
};

exports.updateAddress = async (req, res) => {
  try {
    const { address } = req.body;

    const updated = await User.findOneAndUpdate(
      {
        email: req.user.email
      },
      { $push: { address } },
      { new: true }
    ).exec();

    res.json(updated);
  } catch (error) {
    res.status(400).send('Could not update address.');
  }
};
