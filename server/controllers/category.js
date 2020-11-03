const Category = require('../models/category');
const Subcategory = require('../models/subcategory');
const slugify = require('slugify');

// create
exports.create = async (req, res) => {
  try {
    const { name } = req.body;

    const category = await new Category({
      name,
      slug: slugify(name).toLowerCase()
    }).save();

    res.json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// read
exports.read = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug }).exec();

    res.json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.list = async (_, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 }).exec();

    res.json(categories);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getCategorySubcategories = async (req, res) => {
  try {
    const subcategories = await Subcategory.find({
      parentCategory: req.params._id
    }).exec();

    res.json(subcategories);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// update
exports.update = async (req, res) => {
  try {
    const { name } = req.body;
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
    res.status(400).json({ error: error.message });
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
    res.status(400).json({ error: error.message });
  }
};
