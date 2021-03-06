const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const subcategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      unique: true
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true
    },
    parentCategory: {
      type: ObjectId,
      ref: 'Category',
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Subcategory', subcategorySchema);
