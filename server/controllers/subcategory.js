const Subcategory = require('../models/subcategory');
const slugify = require('slugify');

// create
exports.create = async (req, res) => {
  try {
    const { name, parentCategory } = req.body;

    const subcategory = await new Subcategory({
      name,
      slug: slugify(name).toLowerCase(),
      parentCategory
    }).save();

    res.json(subcategory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// read
exports.read = async (req, res) => {
  try {
    const subcategory = await Subcategory.findOne({
      slug: req.params.slug
    }).exec();

    res.json(subcategory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.list = async (_, res) => {
  try {
    const subcategories = await Subcategory.find()
      .sort({ createdAt: -1 })
      .exec();

    res.json(subcategories);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// update
exports.update = async (req, res) => {
  try {
    const { name, parentCategory } = req.body;

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
    res.status(400).json({ error: error.message });
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
    res.status(400).json({ error: error.message });
  }
};
