const multer = require('multer');

const storage = multer.memoryStorage(); // Store files in memory as Buffer

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf/;
  const extName = allowedTypes.test(file.originalname.toLowerCase());
  const mimeType = allowedTypes.test(file.mimetype);

  if (extName && mimeType) {
    return cb(null, true);
  } else {
    cb(new Error('Only .jpeg, .jpg, .png, and .pdf formats are allowed!'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // limit file size to 5MB
});

module.exports = upload;
