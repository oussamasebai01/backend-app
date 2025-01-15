// multerConfig.js

import multer from "multer";
import path from "path";

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/"); // Destination folder for file uploads
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

// Multer upload initialization
const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed."));
    }
  },
});

export { upload };
