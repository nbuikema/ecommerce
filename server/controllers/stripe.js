const User = require('../models/user');
const Product = require('../models/product');
const Coupon = require('../models/coupon');
const stripe = require('stripe')(process.env.STRIPE_SECRET);
const { calcCartTotal } = require('../helpers/stripe');

// create payment intent
exports.createPaymentIntent = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email })
      .populate({ path: 'cart.product', model: Product })
      .populate('category')
      .exec();

    let totalToCharge = 0;

    const totalFromClient = calcCartTotal(req.body.cart);

    const totalFromServer = calcCartTotal(user.cart);

    if (totalFromClient === totalFromServer) {
      const { coupon: name, discount } = req.body;

      if (name && name.length > 0 && discount && discount > 0) {
        const coupon = await Coupon.findOne({ name });

        if (coupon.name === name && coupon.discount === discount) {
          const totalSaved = Math.round(
            totalFromServer * (coupon.discount / 100) * 100
          );

          totalToCharge = Math.round(totalFromServer * 100) - totalSaved;
        } else {
          throw new Error('Coupons do not match.');
        }
      } else {
        totalToCharge = Math.round(totalFromServer * 100);
      }
    } else {
      throw new Error('Prices do not match.');
    }

    totalToCharge = Math.round(totalToCharge * 1.0625);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalToCharge,
      currency: 'usd'
    });

    res.json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};
