const Product = require('../models/product');
const User = require('../models/user');
const Category = require('../models/category');
const Subcategory = require('../models/subcategory');
const Order = require('../models/order');
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
  const {
    date: { year, month, day }
  } = req.body;

  const orders = await Order.find({
    createdAt: { $gte: new Date(year, month, day) }
  })
    .select('products')
    .populate('products.product')
    .exec();

  let productsBySoldValue = [];

  orders.forEach((order) => {
    let title = '';
    let totalPrice = 0;
    let quantitySold = 0;

    order.products.forEach((product) => {
      const existsIndex = productsBySoldValue.findIndex(
        (x) => x.title === product.product.title
      );

      if (existsIndex > -1) {
        productsBySoldValue[existsIndex].quantitySold += product.quantity;
        productsBySoldValue[existsIndex].totalPrice = parseFloat(
          (
            product.product.price * product.quantity +
            productsBySoldValue[existsIndex].totalPrice
          ).toFixed(2)
        );
      } else {
        title = product.product.title;
        totalPrice = parseFloat(
          (product.product.price * product.quantity).toFixed(2)
        );
        quantitySold = product.quantity;

        productsBySoldValue.push({ title, totalPrice, quantitySold });
      }
    });
  });

  productsBySoldValue.sort((a, b) => b.totalPrice - a.totalPrice);

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
