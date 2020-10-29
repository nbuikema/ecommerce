const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      uppercase: true,
      minlength: [4, 'Name must be at least 4 characters.'],
      maxlength: [12, 'Name must be 12 characters or less.']
    },
    discount: {
      type: Number,
      required: true
    },
    expiration: {
      type: Date,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Coupon', couponSchema);
