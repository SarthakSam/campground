
//======================
//  AUTHENTICATION ROUTES
//======================

const route = require('express').Router();
let User = require('../models/user'),
    passport = require('passport');

route.get('/',(req,res) => {
         res.render('homepage');
    });
    

route.get('/signup',(req,res) => {
    res.render('users/signup');
});

route.post('/signup',(req,res) => {
User.register(new User({email: req.body.email, username: req.body.username}),req.body.password,function(err,user){
        if(err){
            console.log(err);
            res.redirect('/signup');
        }
        else{
            passport.authenticate('local')(req,res,function(){
                res.redirect('/campgrounds');
            });
        }
});
});

route.get('/signin',(req,res) => {
res.render('users/signin');
});

route.post('/signin',passport.authenticate('local',{
successRedirect: '/campgrounds',
failureRedirect: '/signin'
}),(req,res) => {   
});


route.get('/signout',(req,res) => {
 req.logout();
 res.redirect('/campgrounds');
});




module.exports = { route };