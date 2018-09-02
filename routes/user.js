
//======================
//  AUTHENTICATION ROUTES
//======================

const route = require('express').Router();
let   Notif = require('../models/notification'), 
      User = require('../models/user'),
      Campground = require('../models/campgrounds'),
      middleware = require('../middleware'),
      multer = require('../middleware/multer'),
      passport = require('passport');

route.get('/', (req, res) => {
  res.render('homepage');
});


route.get('/signup', (req, res) => {
  res.render('users/signup', { page: "signup" });
});

route.post('/signup', (req, res) => {
  // eval(require('locus'));
  if (!req.body.email || !req.body.username) {
    console.log("Missing credentials")
    req.flash("error", "Missing credentials");
    return res.redirect("/signup");
  }
  User.register(new User({ email: req.body.email, username: req.body.username }), req.body.password, function (err, user) {
    if (err) {
      req.flash("error", err.message);
      res.redirect('/signup');
    }
    else {
      passport.authenticate('local')(req, res, function () {
        req.flash('success', "welcome to postit " + req.body.username);
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

route.get('/admin',middleware.isAuthenticated, (req, res) => {
  User.findOne().where('isModerator').equals('true').exec((err,user)=>{
      if(err){
        req.flash("error","Some error occured while processing your request");
      }
      else{
        Notif.create({type: 2, notificationFor: user._id, notificationBy: req.user._id},(err,notification)=>{
          if(err||!notification){
            req.flash("error","Some error occured while processing your request");
          }
          else{
            req.flash("success","Your request has been sent to the moderator");
          }
          res.redirect("back");
      });
      }
  });  
});

route.post('/admin/:id',middleware.isAuthenticated, (req, res) => {
  if(!req.user.isModerator){
        req.flash("error","You are not authorised to do it");
        res.redirect('back');
  }
  else{
     User.findById(req.params.id,(err,user)=>{
        if(err||!user){
          req.flash("error","Something went wrong");
          res.redirect('back');
        }
        else{
          user.isAdmin = !user.isAdmin;
          user.save();
          if(user.isAdmin){
            req.flash("success",user.username + "is now a admin");
            Notif.create({type: 3, notificationFor: req.params.id, notificationBy: req.user._id},(err,notification)=>{});  
          }
          else{
            req.flash("success",user.username + " is removed from admin role");
          }
          res.redirect('/campgrounds'); 
        }
     }); 
  }
});

route.get('/unreadNotifications', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.send({ status: 404, message: "No user is authenticated" });
  }
  Notif.find({}).where('notificationFor').equals(req.user._id).where('read').equals(false).populate("notificationBy").exec((err, unreadNotifications) => {
    if (err || !unreadNotifications) {
      res.send({ status: 404, notifications: "Something went wrong" });
    }
    else {
      Notif.find({}).where('notificationFor').equals(req.user._id).exec((err, notifications) => {
        if (err) {
          res.send({ status: 404, notifications: "Something went wrong" });
        }
        else {
          res.send({ status: 200,  notifications , unreadNotifications});
        }
      });
    }
  });
});

route.get('/notifications', middleware.isAuthenticated, (req, res) => {
  Notif.find({}).where('notificationFor').equals(req.user._id).populate("notificationBy").exec((err, notifications) => {
    if (err) {
      // console.log("Unable to fetch notifications",err);
      req.flash("error", "Unable to fetch notifications");
    }
    else {
      // console.log(notifications);
    }
    res.render('users/notifications', { notifications });
  });
});

route.put('/markasread/:id', (req, res) => {
  Notif.findByIdAndUpdate(req.params.id, { read: true }, (err, updatedNotification) => {
    if (err) {
      console.log("unable to mark as read");
    }
    else{
      console.log("markedAsRead")
    }
  });
  res.send("yo");
});


module.exports = { route };