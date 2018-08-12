let Campground = require('../models/campgrounds'),
    Comment    = require('../models/comment');

let middleware = {

    isAuthenticated: function(req,res,next){
        if(req.isAuthenticated())
          return next();
          res.redirect('/signin');
        },
    

    isUserAndCreatorSame: function(req,res,next){
            Campground.findById(req.params.id,(err,campground) => {
                    if(err){
                            res.redirect('back');
                            }
                    else{
                            if(campground.postedBy.id.equals(req.user._id)){
                                res.campground= campground;
                                return next();
                             }
                            else{
                                // res.redirect('/campgrounds/'+req.params.id);
                                res.redirect('back');
                             }                   
                        }
            });
    },

    isUserAndCommentCreatorSame: function(req,res,next){
        if(req.isAuthenticated()){
             Comment.findById(req.params.commentId,(err,comment) => {
                    if(err){
                        console.log('no such comment exist');
                        res.redirect("back");
                    }
                    else{
                        if(comment.author.id.equals(req.user._id)){
                            res.comment = comment;
                            return next();
                        }
                        else{
                            console.log("not authorised");
                            res.redirect("back");
                        }
                    }
             }); 
        }
        else{
            res.redirect("back");
        }
    }
    
}   

module.exports = middleware;