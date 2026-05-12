const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const { protect } = require('../middlewares/authMiddleware');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'collabsphere',
    resource_type: 'auto', // Allows uploading images, raw files, etc.
  },
});

const upload = multer({ storage: storage });

router.post('/', protect, (req, res, next) => {
  const uploadMiddleware = upload.single('file');
  uploadMiddleware(req, res, function (err) {
    if (err) {
      console.error('Upload Error:', err);
      return res.status(500).json({ message: 'Upload failed', error: err.message || err });
    }
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    res.json({ 
      url: req.file.path,
      public_id: req.file.filename,
      original_filename: req.file.originalname
    });
  });
});

module.exports = router;
