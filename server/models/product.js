const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
      maxlength: 50,
      text: true
    },
    slug: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      index: true
    },
    description: {
      type: String,
      required: true,
      maxlength: 500,
      text: true
    },
    price: {
      type: Number,
      required: true,
      trim: true
    },
    category: {
      type: ObjectId,
      ref: 'Category'
    },
    subcategories: [
      {
        type: ObjectId,
        ref: 'Subcategory'
      }
    ],
    quantity: Number,
    sold: {
      type: Number,
      default: 0
    },
    images: Array,
    shipping: Boolean,
    ratings: [
      {
        star: Number,
        postedBy: {
          type: ObjectId,
          ref: 'User'
        }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
