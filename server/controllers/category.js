const Category = require('../models/category');
const Subcategory = require('../models/subcategory');
const slugify = require('slugify');

// create
exports.create = async (req, res) => {
  const { name } = req.body;

  try {
    const category = await new Category({
      name,
      slug: slugify(name).toLowerCase()
    }).save();

    res.json(category);
  } catch (error) {
    res.status(400).send('Could not create category.');
  }
};

// read
exports.read = async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug }).exec();

  res.json(category);
};

exports.list = async (_, res) => {
  const categories = await Category.find().sort({ createdAt: -1 }).exec();

  res.json(categories);
};

exports.getCategorySubcategories = async (req, res) => {
  const subcategories = await Subcategory.find({
    parentCategory: req.params._id
  }).exec();

  res.json(subcategories);
};

// update
exports.update = async (req, res) => {
  const { name } = req.body;

  try {
    const updated = await Category.findOneAndUpdate(
      {
        slug: req.params.slug
      },
      {
        name,
        slug: slugify(name).toLowerCase()
      },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(400).send('Could not update category.');
  }
};

// delete
exports.remove = async (req, res) => {
  try {
    const deleted = await Category.findOneAndDelete({
      slug: req.params.slug
    });

    res.json(deleted);
  } catch (error) {
    res.status(400).send('Could not delete category.');
  }
};
