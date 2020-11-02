const Product = require('../models/product');
const User = require('../models/user');
const Category = require('../models/category');
const Subcategory = require('../models/subcategory');
const Order = require('../models/order');
const slugify = require('slugify');
const moment = require('moment');

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
    const currentPage = page;
    const perPage = limit;
    const skipBy = (currentPage - 1) * perPage;

    if (sort && sort === 'averageRating') {
      const products = await Product.aggregate([
        {
          $project: {
            document: '$$ROOT',
            averageRating: { $avg: '$ratings.rating' }
          }
        },
        { $sort: { averageRating: -1 } },
        { $skip: skipBy },
        { $limit: limit }
      ]).exec();

      res.json(products);
    } else {
      const products = await Product.find()
        .skip(skipBy)
        .populate('category')
        .populate('subcategories')
        .sort([[sort, order]])
        .limit(limit)
        .exec();

      res.json(products);
    }
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

exports.listAllInCategory = async (req, res) => {
  const category = await Category.findOne({
    slug: req.params.categorySlug
  }).exec();

  const products = await Product.find({
    category
  })
    .populate('category')
    .populate('subcategories')
    .exec();

  res.json({ products, category });
};

exports.listAllInSubcategory = async (req, res) => {
  const subcategory = await Subcategory.findOne({
    slug: req.params.subcategorySlug
  }).exec();

  const products = await Product.find({
    subcategories: subcategory
  })
    .populate('category')
    .populate('subcategories')
    .exec();

  res.json({ products, subcategory });
};

const handleQuery = async (req, res) => {
  try {
    let filteredSearch = [];
    let foundProducts = [];

    for (let [key, value] of Object.entries(req.body)) {
      if (key === 'query' && value.length > 0) {
        filteredSearch.push({ $text: { $search: value } });
      }

      if (key === 'price' && value[0] >= 0 && value[1] > 0) {
        filteredSearch.push({ price: { $gte: value[0], $lte: value[1] } });
      }

      if (key === 'categories' && value.length > 0) {
        filteredSearch.push({ category: value });
      }

      if (key === 'subcategories' && value.length > 0) {
        filteredSearch.push({ subcategories: { $in: value } });
      }

      if (key === 'rating' && value) {
        await Product.aggregate([
          {
            $project: {
              document: '$$ROOT',
              floorAverage: {
                $floor: { $avg: '$ratings.rating' }
              }
            }
          },
          { $match: { floorAverage: value } }
        ])
          .exec()
          .then((aggregates) => {
            aggregates.forEach((product) => {
              foundProducts.push(product._id.toString());
            });
          });

        filteredSearch.push({ _id: foundProducts });
      }

      if (key === 'shipping' && value !== null) {
        filteredSearch.push({ shipping: value });
      }
    }

    const products = await Product.find({
      $and: filteredSearch
    })
      .populate('category')
      .populate('subcategory')
      .sort([req.body.sort])
      .exec();

    res.json(products);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

exports.searchFilters = async (req, res) => {
  try {
    await handleQuery(req, res);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getProductsBySoldValue = async (req, res) => {
  const { date, sort } = req.body;

  let query;

  if (date === 'Overall') {
    query = { orderedYear: { $gte: 0 } };
  }
  if (date === 'This Year') {
    query = { orderedYear: { $eq: new Date().getFullYear() } };
  }
  if (date === 'This Month') {
    query = {
      orderedMonth: { $eq: new Date().getMonth() + 1 },
      orderedYear: { $eq: new Date().getFullYear() }
    };
  }
  if (date === 'This Week') {
    query = {
      orderedWeek: { $eq: moment(new Date()).week() - 1 },
      orderedYear: { $eq: new Date().getFullYear() }
    };
  }
  if (date === 'Today') {
    query = {
      orderedYear: { $eq: new Date().getFullYear() },
      orderedMonth: { $eq: new Date().getMonth() + 1 },
      orderedDayOfMonth: { $eq: new Date().getDate() }
    };
  }

  const orders = await Order.aggregate([
    {
      $lookup: {
        from: 'products',
        localField: 'products.product',
        foreignField: '_id',
        as: 'productsList'
      }
    },
    {
      $addFields: {
        orderedMonth: { $month: '$createdAt' },
        orderedDayOfMonth: { $dayOfMonth: '$createdAt' },
        orderedYear: { $year: '$createdAt' },
        orderedWeek: { $week: '$createdAt' },
        orderedDayOfWeek: { $dayOfWeek: '$createdAt' }
      }
    },
    { $match: query }
  ]);

  let productsBySoldValue = [];

  orders.forEach((order) => {
    let title = '';
    let total = 0;
    let sold = 0;

    order.productsList.forEach((product, index) => {
      const existsIndex = productsBySoldValue.findIndex(
        (x) => x.title === product.title
      );

      if (existsIndex > -1) {
        productsBySoldValue[existsIndex].sold += order.products[index].quantity;
        productsBySoldValue[existsIndex].total = parseFloat(
          (
            product.price * order.products[index].quantity +
            productsBySoldValue[existsIndex].total
          ).toFixed(2)
        );
      } else {
        title = product.title;
        total = parseFloat(
          (product.price * order.products[index].quantity).toFixed(2)
        );
        sold = order.products[index].quantity;

        productsBySoldValue.push({ title, total, sold });
      }
    });
  });

  if (sort === 'Total Price - High to Low') {
    productsBySoldValue.sort((a, b) => b.total - a.total);
  }

  if (sort === 'Total Price - Low to High') {
    productsBySoldValue.sort((a, b) => a.total - b.total);
  }

  if (sort === 'Number Sold - High to Low') {
    productsBySoldValue.sort((a, b) => b.sold - a.sold);
  }

  if (sort === 'Number Sold - Low to High') {
    productsBySoldValue.sort((a, b) => a.sold - b.sold);
  }

  res.json(productsBySoldValue);
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
