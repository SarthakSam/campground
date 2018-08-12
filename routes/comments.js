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
                          let obj = {
                                          text: req.body.commentText,
                                          author: {
                                                    name: req.user.username,
                                                    id: req.user._id      
                                                   }
                                    }
                          Comment.create(obj,(err,comment) => {
                              if(err){
                                  console.log(err);
                              }
                              else{
                                //   console.log(comment);
                                campground.comments.push(comment);
                                campground.save();
                              }
                              res.redirect('/campgrounds/'+req.params.id);       
                          });
                      } 
                });
            }    
   });
});

route.get('/:commentId/edit',isUserAndCommentCreatorSame,(req,res) => {
        let comment = res.comment;
        Campground.findById(req.params.id, (err,campground) => {
            if(err)
                res.redirect("back");
            else{
                res.render('comments/edit', { comment,campground });
            }    
        });
});

route.put('/:commentId',isUserAndCommentCreatorSame,(req,res) => {
       let comment = { text: req.body.commentText };
       Comment.findByIdAndUpdate(req.params.commentId,comment,(err,updatedComment) => {
            if(err){
                console.log(err);
            }
            else{
                // console.log(updatedComment);
            }
            res.redirect('/campgrounds/'+req.params.id);
       });
});

route.delete('/:commentId',isUserAndCommentCreatorSame,(req,res) => {
    Comment.findByIdAndRemove(req.params.commentId,(err) => {
         if(err){
             console.log(err);
         }
         res.redirect('/campgrounds/'+req.params.id);
    });
});

function isUserAndCommentCreatorSame(req,res,next){
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


function isAuthenticated(req,res,next){
    if(req.isAuthenticated())
      return next();
      res.redirect('/signin');
    }
    


module.exports = { route };
