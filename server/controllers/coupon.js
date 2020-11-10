const Coupon = require('../models/coupon');
const moment = require('moment');

// create
exports.create = async (req, res) => {
  try {
    const coupon = await new Coupon(req.body).save();

    res.json(coupon);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// read
exports.read = async (req, res) => {
  try {
    const coupon = await Coupon.findOne({ name: req.params.couponName })
      .select('name discount expiration')
      .exec();

    if (!coupon) {
      throw new Error('Coupon not found.');
    }

    const currentDate = moment(Date.now()).toDate();

    const expired = currentDate > coupon.expiration;

    if (expired) {
      throw new Error('Coupon is expired.');
    }

    res.json(coupon);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.list = async (_, res) => {
  try {
    const coupons = await Coupon.find().exec();

    res.json(coupons);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// update
exports.update = async (req, res) => {
  try {
    const updated = await Coupon.findOneAndUpdate(
      { name: req.params.couponName },
      req.body,
      { new: true }
    ).exec();

    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// delete
exports.remove = async (req, res) => {
  try {
    const deleted = await Coupon.findByIdAndDelete(req.params.couponId).exec();

    res.json(deleted);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
