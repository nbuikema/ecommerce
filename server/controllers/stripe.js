const User = require('../models/user');
const Product = require('../models/product');
const Coupon = require('../models/coupon');
const stripe = require('stripe')(process.env.STRIPE_SECRET);

exports.createPaymentIntent = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email })
      .populate({ path: 'cart.product', model: Product })
      .populate('category')
      .exec();

    let totalToCharge = 0;

    const totalFromClient = parseFloat(
      req.body.cart
        .reduce((acc, item) => {
          return acc + item.quantity * item.product.price;
        }, 0)
        .toFixed(2)
    );

    const totalFromServer = parseFloat(
      user.cart
        .reduce((acc, item) => {
          return acc + item.quantity * item.product.price;
        }, 0)
        .toFixed(2)
    );

    if (totalFromClient === totalFromServer) {
      if (
        req.body.coupon &&
        req.body.coupon.length > 0 &&
        req.body.discount &&
        req.body.discount > 0
      ) {
        const coupon = await Coupon.findOne({ name: req.body.coupon });

        if (
          coupon.name === req.body.coupon &&
          coupon.discount === req.body.discount
        ) {
          totalToCharge = Math.round(
            totalFromServer * (coupon.discount / 100) * 100
          );
        } else {
          throw new Error('Coupons do not match.');
        }
      } else {
        totalToCharge = Math.round(totalFromServer * 100);
      }
    } else {
      throw new Error('Prices do not match.');
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalToCharge,
      currency: 'usd'
    });

    res.json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    console.log(error);
  }
};
