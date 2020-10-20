const Subcategory = require('../models/subcategory');
const slugify = require('slugify');

// create
exports.create = async (req, res) => {
  const { name, parentCategory } = req.body;

  try {
    const subcategory = await new Subcategory({
      name,
      slug: slugify(name).toLowerCase(),
      parentCategory
    }).save();

    res.json(subcategory);
  } catch (error) {
    res.status(400).send('Could not create subcategory.');
  }
};

// read
exports.read = async (req, res) => {
  const subcategory = await Subcategory.findOne({
    slug: req.params.slug
  }).exec();

  res.json(subcategory);
};

exports.list = async (_, res) => {
  const subcategories = await Subcategory.find().sort({ createdAt: -1 }).exec();

  res.json(subcategories);
};

// update
exports.update = async (req, res) => {
  const { name, parentCategory } = req.body;

  try {
    const updated = await Subcategory.findOneAndUpdate(
      {
        slug: req.params.slug
      },
      {
        name,
        slug: slugify(name).toLowerCase(),
        parentCategory
      },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(400).send('Could not update subcategory.');
  }
};

// delete
exports.remove = async (req, res) => {
  try {
    const deleted = await Subcategory.findOneAndDelete({
      slug: req.params.slug
    });

    res.json(deleted);
  } catch (error) {
    res.status(400).send('Could not delete subcategory.');
  }
};
