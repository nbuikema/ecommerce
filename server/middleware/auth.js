const admin = require('../firebase');

exports.authCheck = async (req, _, next) => {
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
