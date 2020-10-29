const Coupon = require('../models/coupon');

// create
exports.create = async (req, res) => {
  try {
    const coupon = await new Coupon(req.body).save();

    res.json(coupon);
  } catch (error) {
    res.status(400).send('Could not create coupon.');
  }
};

// read
exports.read = async (req, res) => {
  const coupon = await Coupon.findOne({ name: req.params.couponName }).exec();

  res.json(coupon);
};

exports.list = async (_, res) => {
  const coupons = await Coupon.find().exec();

  res.json(coupons);
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
    res.status(400).send('Could not update coupon.');
  }
};

// delete
exports.remove = async (req, res) => {
  try {
    const deleted = await Coupon.findByIdAndDelete(req.params.couponId).exec();

    res.json(deleted);
  } catch (error) {
    res.status(400).send('Could not delete coupon.');
  }
};
