const Product = require('../models/product');
const User = require('../models/user');
const Category = require('../models/category');
const Subcategory = require('../models/subcategory');
const Order = require('../models/order');
const slugify = require('slugify');
const { setQuery, setProductsByDate } = require('../helpers/product');

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
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .populate('category')
      .populate('subcategories')
      .exec();

    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.list = async (req, res) => {
  try {
    const products = await Product.find()
      .limit(parseInt(req.params.count))
      .populate('category')
      .populate('subcategories')
      .sort([['createdAt', 'desc']])
      .exec();

    res.json(products);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.listCount = async (_, res) => {
  try {
    const totalProducts = await Product.find().estimatedDocumentCount().exec();

    res.json(totalProducts);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
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
          $addFields: {
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
  try {
    const product = await Product.findById(req.params.productId).exec();

    const related = await Product.find({
      _id: { $ne: product._id },
      category: product.category
    })
      .limit(3)
      .sort([['createdAt', 'desc']])
      .exec();

    res.json(related);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.listAllInCategory = async (req, res) => {
  try {
    const category = await Category.findOne({
      slug: req.params.categorySlug
    }).exec();

    const products = await Product.find({
      category
    }).exec();

    res.json({ products, category });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.listAllInSubcategory = async (req, res) => {
  try {
    const subcategory = await Subcategory.findOne({
      slug: req.params.subcategorySlug
    }).exec();

    const products = await Product.find({
      subcategories: subcategory
    }).exec();

    res.json({ products, subcategory });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const handleQuery = async (req, res) => {
  try {
    let filteredSearch = [];
    let foundProducts = [];

    const { limit, page } = req.body;
    const currentPage = page;
    const perPage = limit;
    const skipBy = (currentPage - 1) * perPage;

    for (let [key, value] of Object.entries(req.body)) {
      if (key === 'query' && value.length > 0) {
        filteredSearch.push({ $text: { $search: value } });
      } else if (key === 'price' && value[0] >= 0 && value[1] > 0) {
        filteredSearch.push({ price: { $gte: value[0], $lte: value[1] } });
      } else if (key === 'categories' && value.length > 0) {
        filteredSearch.push({ category: value });
      } else if (key === 'subcategories' && value.length > 0) {
        filteredSearch.push({ subcategories: { $in: value } });
      } else if (key === 'rating' && value) {
        await Product.aggregate([
          {
            $project: {
              document: '$$ROOT',
              floorAverage: {
                $floor: { $avg: '$ratings.rating' }
              }
            }
          },
          { $match: { floorAverage: { $gte: value } } }
        ])
          .exec()
          .then((aggregates) => {
            aggregates.forEach((product) => {
              foundProducts.push(product._id.toString());
            });
          });

        filteredSearch.push({ _id: foundProducts });
      } else if (key === 'shipping' && value !== null) {
        filteredSearch.push({ shipping: value });
      }
    }

    const products = await Product.find({
      $and: filteredSearch
    })
      .skip(skipBy)
      .limit(limit)
      .sort([req.body.sort])
      .exec();

    return products;
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.searchFilters = async (req, res) => {
  try {
    const products = await handleQuery(req, res);

    res.json(products);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.listCountWithFilters = async (req, res) => {
  try {
    const products = await handleQuery(req, res);

    res.json(products.length);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getProductsByDate = async (req, res) => {
  try {
    const { date, sort } = req.body;

    const query = setQuery(date);

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

    const productsByDate = setProductsByDate(sort, orders);

    res.json(productsByDate);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getProductsByInventory = async (req, res) => {
  try {
    const { sort } = req.body;

    const products = await Product.find()
      .sort([['quantity', sort]])
      .select('-_id title quantity')
      .exec();

    res.json(products);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
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
    res.status(400).json({ error: error.message });
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
    res.status(400).json({ error: error.message });
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
    res.status(400).json({ error: error.message });
  }
};
