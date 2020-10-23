const Product = require('../models/product');
const User = require('../models/user');
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
exports.read = async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug })
    .populate('category')
    .populate('subcategories')
    .exec();

  res.json(product);
};

exports.list = async (req, res) => {
  const products = await Product.find()
    .limit(parseInt(req.params.count))
    .populate('category')
    .populate('subcategories')
    .sort([['createdAt', 'desc']])
    .exec();

  res.json(products);
};

exports.listCount = async (_, res) => {
  const totalProducts = await Product.find().estimatedDocumentCount().exec();

  res.json(totalProducts);
};

exports.listWithQuery = async (req, res) => {
  try {
    const { sort, order, limit, page } = req.body;
    const currentPage = page || 1;
    const perPage = limit || 3;

    const products = await Product.find()
      .skip((currentPage - 1) * perPage)
      .populate('category')
      .populate('subcategories')
      .sort([[sort, order]])
      .limit(limit)
      .exec();

    res.json(products);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.listRelated = async (req, res) => {
  const product = await Product.findById(req.params.productId).exec();

  const related = await Product.find({
    _id: { $ne: product._id },
    category: product.category
  })
    .limit(3)
    .populate('category')
    .populate('subcategories')
    .sort([['createdAt', 'desc']])
    .exec();

  res.json(related);
};

// update
exports.update = async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title).toLowerCase();
    }

    const updated = await Product.findOneAndUpdate(
      {
        slug: req.params.slug
      },
      req.body,
      { new: true }
    ).exec();

    res.json(updated);
  } catch (error) {
    res.status(400).send('Could not update category.');
  }
};

exports.rateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId).exec();

    const user = await User.findOne({ email: req.user.email }).exec();

    const existingRating = product.ratings.find((rating) => {
      return rating.postedBy.toString() === user._id.toString();
    });

    if (existingRating) {
      const updatedRating = await Product.updateOne(
        {
          ratings: { $elemMatch: existingRating }
        },
        {
          $set: { 'ratings.$.rating': req.body.rating }
        },
        {
          new: true,
          timestamps: false
        }
      ).exec();

      res.json(updatedRating);
    } else {
      const newRating = await Product.findByIdAndUpdate(
        product._id,
        {
          $push: { ratings: { rating: req.body.rating, postedBy: user._id } }
        },
        {
          new: true,
          timestamps: false
        }
      ).exec();

      res.json(newRating);
    }
  } catch (error) {
    res.status(400).send('Could not leave rating for this product.');
  }
};

// delete
exports.remove = async (req, res) => {
  try {
    const deleted = await Product.findOneAndDelete({
      slug: req.params.slug
    }).exec();

    res.json(deleted);
  } catch (error) {
    res.status(400).send('Could not delete product.');
  }
};
