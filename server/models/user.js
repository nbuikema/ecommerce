const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: {
      type: String,
      required: true,
      index: true,
      unique: true
    },
    role: {
      type: String,
      required: true,
      default: 'customer'
    },
    cart: {
      type: Array,
      default: []
    },
    /*cart: [
      {
        _id: false,
        product: {
          type: ObjectId,
          ref: 'Product'
        },
        quantity: Number
      }
    ],*/
    address: {
      type: Array,
      default: []
    },
    orders: [
      {
        type: ObjectId,
        ref: 'Order'
      }
    ],
    wishlist: [
      {
        type: ObjectId,
        ref: 'Product'
      }
    ],
    lastLogin: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
