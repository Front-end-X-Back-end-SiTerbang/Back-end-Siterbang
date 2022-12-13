const multer = require("multer");
const path = require("path");

// const storage = multer.diskStorage({
//   destination: (req, file, callback) => {
//     callback(null, "./public/images");
//   },

//   // generate file unique name
//   filename: (req, file, callback) => {
//     const nameFile = Date.now() + path.extname(file.originalname);
//     callback(null, nameFile);
//   },
// });

module.exports = {
  image: multer({

    // add file filter
    fileFilter: (req, file, callback) => {
      if (
        file.mimetype == "image/png" ||
        file.mimetype == "image/jpg" ||
        file.mimetype == "image/jpeg"
      ) {
        callback(null, true);
      } else {
        const err = new Error("only png, jpg, and jpeg allowed to upload!");
        callback(err, false);
      }
    },

    // error handling
    onError: (err, next) => {
      next(err);
    },
  }),
};
