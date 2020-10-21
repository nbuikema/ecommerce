const Product = require('../models/product');
const slugify = require('slugify');

// create
exports.create = async (req, res) => {
  try {
    req.body.slug = slugify(req.body.title).toLowerCase();

    const product = await new Product(req.body).save();

    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// read
exports.list = async (_, res) => {
  const products = await Product.find().sort({ createdAt: -1 }).exec();

  res.json(products);
};

// update

// delete
