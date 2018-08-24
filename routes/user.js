
//======================
//  AUTHENTICATION ROUTES
//======================

const route = require('express').Router();
let User = require('../models/user'),
  Campground = require('../models/campgrounds'),
  middleware = require('../middleware'),
  multer = require('../middleware/multer'),
  passport = require('passport');

route.get('/', (req, res) => {
  res.render('homepage');
});

route.get('/profile', middleware.isAuthenticated, (req, res) => {
  Campground.find({}).where('postedBy.id').equals(req.user._id).exec(function (err, campgrounds) {
    if (err) {
      req.flash("error", "Something went wrong!!!!");
      res.redirect("back");
    }
    else {
      console.log("profile",req.user);
      console.log(req.user.coverphoto);
      res.render('users/profile', { page: "profile", usercampgrounds: campgrounds });
    }
  });

});

route.get('/profile/edit', middleware.isAuthenticated, (req, res) => {
  res.render('users/edit');
});

route.put('/profile/edit', middleware.isAuthenticated, (req, res) => {
  User.findByIdAndUpdate(req.user._id, req.body.user, (err) => {
    if (err) {
      req.flash("error", "Unable to update profile info");
    }
    else {
      req.flash("success", "Profile Info Updated successfully!!!");
    }
    res.redirect('/profile');
  });
});

route.put('/profile/upload', middleware.isAuthenticated, multer.upload.single('image'), (req, res) => {
  if (req.file) {
    multer.cloudinary.uploader.upload(req.file.path, function (result) {

      User.findById(req.user._id, (err, user) => {
        if (err || !user) {
          console.log("unable to find user");
          req.flash("error", "Unable to find user");
        }
        else {
          if (user.coverphoto && user.coverphoto.includes("cloudinary")) {
            let str = user.coverphoto;
            multer.cloudinary.v2.uploader.destroy(str.substring(str.lastIndexOf('/') + 1, str.lastIndexOf('.')), function (error, result) { console.log(result, error) });
          }
          req.flash("success","Photo uploaded successfully");
          user.coverphoto = result.secure_url;
          user.save();
        }
        console.log(user);
        res.redirect('/profile');
      });
    });
  }
  else {
        req.flash("error","File not recieved");
        res.redirect("/profile");      
  }
});

route.get('/signup', (req, res) => {
  res.render('users/signup', { page: "signup" });
});

route.post('/signup', (req, res) => {
  // eval(require('locus'));
  User.register(new User({ email: req.body.email, username: req.body.username }), req.body.password, function (err, user) {
    if (err) {
      req.flash("error", err.message);
      res.redirect('/signup');
    }
    else {
      passport.authenticate('local')(req, res, function () {
        req.flash('success', "welcome to yelpcamp " + req.body.username);
        res.redirect('/campgrounds');
      });
    }
  });
});

route.get('/signin', (req, res) => {
  res.render('users/signin', { page: "signin" });
});

route.post('/signin', passport.authenticate('local', {
  successRedirect: '/campgrounds',
  failureRedirect: '/signin',
  failureFlash: true
}), (req, res) => {
});


route.get('/signout', (req, res) => {
  req.logout();
  req.flash("success", "You are logged out");
  res.redirect('/campgrounds');
});

route.get('/forgot', (req, res) => {
  if (!req.user)
    res.render('users/forgot');
  else
    res.redirect('/campgrounds');
});

route.post('/forgot', (req, res) => {
  if (req.user)
    res.redirect('/campgrounds');
  else {
    async.waterfall([
      function (done) {
        crypto.randomBytes(20, function (err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function (token, done) {
        User.findOne({ email: req.body.email }, function (err, user) {
          if (!user) {
            req.flash('error', 'No account with that email address exists.');
            return res.redirect('/forgot');
          }

          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

          user.save(function (err) {
            done(err, token, user);
          });
        });
      },
      function (token, user, done) {
        let smtpTransport = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: 'expressproject294@gmail.com',
            pass: process.env.Gmail_Pass
          }
        });
        let mailOptions = {
          to: user.email,
          from: 'yelpcamp',
          subject: ' Password Reset',
          text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + req.headers.host + '/reset/' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };
        smtpTransport.sendMail(mailOptions, function (err) {
          req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
          done(err, 'done');
        });
      }
    ], function (err) {
      if (err) {
        req.flash('error', err.message);
        res.redirect("back");
      }
      else {
        res.redirect('/campgrounds');
      }
    });
  }
});

route.get('/reset/:token', (req, res) => {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    res.render('users/reset', {
      token: req.params.token
    });
  });
});

route.post('/reset/:token', function (req, res) {
  async.waterfall([
    function (done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }
        if (req.body.password === req.body.confirm) {
          user.setPassword(req.body.password, function (err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function (err) {
              req.logIn(user, function (err) {
                done(err, user);
              });
            });
          })
        } else {
          req.flash("error", "Passwords do not match.");
          return res.redirect('back');
        }
      });
    },
    function (user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'expressproject294@gmail.com',
          pass: process.env.Gmail_Pass
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'Yelpcamp',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function (err) {
        req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function (err) {
    res.redirect('/campgrounds');
  });
});


module.exports = { route };