const User = require('../models/user');
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
    res.status(400).json({ error: error.message });
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
    res.status(400).json({ error: error.message });
  }
};

exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { email: req.user.email },
      { $addToSet: { wishlist: productId } },
      { new: true }
    )
      .populate({
        path: 'orders',
        populate: {
          path: 'products.product'
        }
      })
      .populate('wishlist')
      .select('-cart -__v -createdAt -updatedAt')
      .exec();

    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.readWishlist = async (req, res) => {
  try {
    const wishlist = await (await User.findOne({ email: req.user.email }))
      .isSelected('wishlist')
      .populate('wishlist')
      .exec();

    res.json(wishlist);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    const updatedUser = await User.findOneAndUpdate(
      { email: req.user.email },
      { $pull: { wishlist: productId } },
      { new: true }
    )
      .populate({
        path: 'orders',
        populate: {
          path: 'products.product'
        }
      })
      .populate('wishlist')
      .select('-cart -__v -createdAt -updatedAt')
      .exec();

    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
