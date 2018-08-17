
//======================
//  AUTHENTICATION ROUTES
//======================

const route = require('express').Router();
let User = require('../models/user'),
    middleware = require('../middleware');
    passport = require('passport');

route.get('/',(req,res) => {
         res.render('homepage');
    });

route.get('/profile',middleware.isAuthenticated,(req,res) => {
      res.render('users/profile',{user: req.user , page: "profile" } );
});

    

route.get('/signup',(req,res) => {
    res.render('users/signup',{ page: "signup"});
});

route.post('/signup',(req,res) => {
User.register(new User({email: req.body.email, username: req.body.username}),req.body.password,function(err,user){
        if(err){
            req.flash("error",err.message);
            res.redirect('/signup');
        }
        else{
            passport.authenticate('local')(req,res,function(){
                req.flash('success',"welcome to yelpcamp "+ req.body.username);
                res.redirect('/campgrounds');
            });
        }
});
});

route.get('/signin',(req,res) => {
res.render('users/signin',{ page: "signin"});
});

route.post('/signin',passport.authenticate('local',{
successRedirect: '/campgrounds',
failureRedirect: '/signin',
failureFlash: true
}),(req,res) => {   
});


route.get('/signout',(req,res) => {
 req.logout();
 req.flash("success","You are logged out");
 res.redirect('/campgrounds');
});




module.exports = { route };