const admin = require('../firebase');
const User = require('../models/user');

exports.authCheck = async (req, res, next) => {
  try {
    req.user = await admin.auth().verifyIdToken(req.headers.authtoken);

    next();
  } catch (error) {
    return res.status(400).json({
      error: {
        message: 'Invalid or expired token.'
      }
    });
  }
};

exports.adminCheck = async (req, res, next) => {
  try {
    const { email } = req.user;

    const adminUser = await User.findOne({ email }).exec();

    if (adminUser.role !== 'admin') {
      return res.status(403).json({
        error: {
          message: 'Access denied - insufficient privileges.'
        }
      });
    }

    next();
  } catch (error) {
    return res.status(400).json({
      error: {
        message: 'Invalid or expired token.'
      }
    });
  }
};
