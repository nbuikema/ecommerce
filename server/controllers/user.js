const User = require('../models/user');
const Product = require('../models/product');
const Order = require('../models/order');
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

exports.createOrder = async (req, res) => {
  try {
    const { cart, address, paymentIntent } = req.body;

    const foundUser = await User.findOne({ email: req.user.email }).exec();

    const newOrder = await new Order({
      products: cart,
      paymentIntent: paymentIntent.paymentIntent,
      orderedBy: foundUser._id,
      address
    }).save();

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

    res.json(newOrder);
  } catch (error) {
    console.log(error);
    res.status(400).send('Could not create order.');
  }
};
