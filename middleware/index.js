let Campground = require('../models/campgrounds'),
    Comment    = require('../models/comment');

let middleware = {

    isAuthenticated: function(req,res,next){
        if(req.isAuthenticated())
          return next();
          req.flash("error","Please signin first");
          console.log("User not authenticated");
          res.redirect('/signin');
        },
    

    isUserAndCreatorSame: function(req,res,next){
            Campground.findById(req.params.id,(err,campground) => {
                    if(err||!campground){
                            req.flash("error","No such campground exist");
                            res.redirect('back');
                           }
                    else{
                            if(campground.postedBy.id.equals(req.user._id)){
                                res.campground= campground;
                                return next();
                             }
                            else{
                                // res.redirect('/campgrounds/'+req.params.id);
                                req.flash("error","You are not authorised to do it."); 
                                res.redirect('back');
                             }                   
                        }
            });
    },

    isUserAndCommentCreatorSame: function(req,res,next){
        if(req.isAuthenticated()){
             Comment.findById(req.params.commentId,(err,comment) => {
                    if(err||!comment){
                        req.flash("error","No such comment exist");
                        res.redirect("back");
                    }
                    else{
                        if(comment.author.id.equals(req.user._id)){
                            res.comment = comment;
                            return next();
                        }
                        else{
                             req.flash("error","You are not authorised to do it."); 

                            res.redirect("back");
                        }
                    }
             }); 
        }
        else{
            req.flash("eror","Please Signin first");
            res.redirect("back");
        }
    },

    ajaxIsAuthenticated: function(req,res,next){
            if(req.user){
                return next();
            }
            else{
                req.flash("error","User not authenticated")
                res.send({message: "User not authenticated", status: 600});
            }
    },

    ajaxIsUserAndCreatorSame: function(req,res,next){
        Campground.findById(req.params.id,(err,campground) => {
            if(err||!campground){
                req.flash("error","No such campground");
                res.send({message: "No such campground", status: 600});
            }
            else{
                    if(campground.postedBy.id.equals(req.user._id)){
                        res.campground= campground;
                        return next();
                     }
                    else{
                        req.flash("error","You are not authorised to do it")
                        res.send({message: "You are not authorised to do it", status: 600});
                    }                   
                }
    });
    }
    
}   

module.exports = middleware;