const cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

exports.upload = async (req, res) => {
  const result = await cloudinary.uploader.upload(req.body.image, {
    public_id: `${Date.now()}`,
    resource_type: 'auto'
  });

  res.json({
    public_id: result.public_id,
    url: result.secure_url
  });
};

exports.remove = (req, res) => {
  cloudinary.uploader.destroy(req.body.public_id, (result, error) => {
    if (error || result.result !== 'ok') {
      return res.status(400).json('There was an issue removing this image.');
    }

    res.json({ result });
  });
};
