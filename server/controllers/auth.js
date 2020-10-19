const User = require('../models/user');

// create

exports.createOrUpdateUser = async (req, res) => {
  let { name, email } = req.user;

  if (!name) {
    name = email.split('@')[0];
  }

  const user = await User.findOneAndUpdate({ email }, { name }, { new: true });

  if (user) {
    return res.json(user);
  } else {
    const newUser = await new User({
      email,
      name
    }).save();

    return res.json(newUser);
  }
};

// read

exports.currentUser = async (req, res) => {
  await User.findOne({ email: req.user.email }).exec((error, user) => {
    if (error) {
      throw new Error(error);
    }
    return res.json(user);
  });
};

// update
// delete
