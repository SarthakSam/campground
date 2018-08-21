let multer = require('multer'),
    cloudinary = require('cloudinary');
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
    api_key: '546344731792928', 
    api_secret: 'du4hISWc6c-CA5qcto1buCWtSX8'
  });

module.exports = {
   upload: multer({ storage: storage, fileFilter: imageFilter}),
   cloudinary: cloudinary
}

