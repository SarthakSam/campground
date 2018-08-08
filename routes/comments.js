// ==========================
//    COMMENTS ROUTES
//==========================

const route    = require('express').Router({mergeParams: true});
let Campground = require('../models/campgrounds'),
    Comment    = require('../models/comment');       


route.get('/new',isAuthenticated,(req,res) => {
    console.log("id",req.params.id);
    Campground.findById(req.params.id, (error,campground) => {
        if(error){
            console.log(error);
            res.redirect('/campgrounds/'+req.params.id);
        }
            
        else{
            res.render('comments/new',{ campground });
        }    
});
});
    

route.post('/',isAuthenticated,(req,res) => {
   Campground.findById(req.params.id, (error,campground) => {
            if(error)
                console.log(error);
            else{
                Comment.create(req.body.comment, (err,comment) => {
                      if(err)
                          console.log(err);
                      else{
                          campground.comments.push(comment);
                          campground.save();
                          res.redirect('/campgrounds/'+req.params.id);
                      } 
                });
            }    
   });
});

function isAuthenticated(req,res,next){
    if(req.isAuthenticated())
      return next();
      res.redirect('/signin');
    }
    


module.exports = { route };
