const multer = require('multer'); // Import multer
const path = require('path'); // Import path module for handling file paths

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Set upload directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Create unique file name
  },
});

// Initialize and export multer
const upload = multer({ storage });

module.exports = upload;
