const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        _id: false,
        product: {
          type: ObjectId,
          ref: 'Product'
        },
        quantity: Number
      }
    ],
    paymentIntent: {},
    orderStatus: {
      type: String,
      default: 'Received',
      enum: [
        'Received',
        'Processing',
        'Shipped',
        'Delivered',
        'Completed',
        'Cancelled',
        'Delayed'
      ]
    },
    expectedDelivery: Date,
    orderedBy: {
      type: ObjectId,
      ref: 'User'
    },
    address: {}
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
