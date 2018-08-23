let multer = require('multer'),
    cloudinary = require('cloudinary');

 
require('dotenv').config();   
var storage = multer.diskStorage({
    filename: function(req, file, callback) {
      callback(null, Date.now() + file.originalname);
    }
  });
  var imageFilter = function (req, file, cb) {
      // accept image files only
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
          return cb(new Error('Only image files are allowed!'), false);
      }
      cb(null, true);
  };
  cloudinary.config({ 
    cloud_name: 'bvcoe', 
    api_key: process.env.Cloudinary_key, 
    api_secret: process.env.Cloudinary_Pass
  });

module.exports = {
   upload: multer({ storage: storage, fileFilter: imageFilter}),
   cloudinary: cloudinary
}

