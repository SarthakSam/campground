const route = require('express').Router({ mergeParams: true });
let Campground = require('../models/campgrounds'),
    Comment = require('../models/comment'),
    middleware = require('../middleware'),
    Notif = require('../models/notification'),
    User = require('../models/user');


route.get('/new', middleware.isAuthenticated, (req, res) => {
    Campground.findById(req.params.id, (error, campground) => {
        if (error) {
            console.log(error);
            req.flash("error", "Some error occured");
            res.redirect('/campgrounds/' + req.params.id);
        }
        else {
            res.render('comments/new', { campground });
        }
    });
});


route.post('/', middleware.isAuthenticated, (req, res) => {
    Campground.findById(req.params.id, (error, campground) => {
        if (error) {
            console.log(error);
            req.flash("error", "No such campground occur");
            res.redirect('/campgrounds/' + req.params.id);
        }
        else {
            let obj = {
                text: req.body.commentText,
                author: {
                    name: req.user.username,
                    id: req.user._id
                }
            }
            Comment.create(obj, (err, comment) => {
                if (err) {
                    console.log(err);
                    req.flash("error", "Unable to post comment");
                }
                else {
                    //   console.log(comment);
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Comment posted successfully");
                    //Code for notifications
                    if (!campground.postedBy.id.equals(req.user._id)) {
                        let notificationObject = {};
                        notificationObject.type = 1;
                        notificationObject.notificationFor = campground.postedBy.id;
                        notificationObject.post = {};
                        notificationObject.post.id = campground._id;
                        notificationObject.post.name = campground.name;
                        notificationObject.notificationBy = req.user._id;
                        Notif.create(notificationObject, (err, notification) => {
                            if (err) {
                                console.log("unable to create notification");
                            }
                            else {
                                console.log("notification added to db");
                            }
                        });
                    }
                }
                res.redirect('/campgrounds/' + req.params.id);
            });
        }
    });
});

route.get('/:commentId/edit', middleware.isUserAndCommentCreatorSame, (req, res) => {
    let comment = res.comment;
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            req.flash("error", "No such campground occur");
            res.redirect("back");
        }
        else {
            res.render('comments/edit', { comment, campground });
        }
    });
});

route.put('/:commentId', middleware.isUserAndCommentCreatorSame, (req, res) => {
    let comment = { text: req.body.commentText };
    Comment.findByIdAndUpdate(req.params.commentId, comment, (err, updatedComment) => {
        if (err) {
            console.log(err);
            req.flash("error", "Unable to update comment");
        }
        else {
            // console.log(updatedComment);
            req.flash("success", "Comment updated successfully");
        }
        res.redirect('/campgrounds/' + req.params.id);
    });
});

route.delete('/:commentId', middleware.isUserAndCommentCreatorSame, (req, res) => {
    Comment.findByIdAndRemove(req.params.commentId, (err) => {
        if (err) {
            console.log(err);
            req.flash("error", "Unable to deleted comment");
        }
        else {
            req.flash("success", "Comment deleted successfully");
        }
        res.redirect('/campgrounds/' + req.params.id);
    });
});

route.post('/:commentId/like', middleware.isAuthenticated, (req, res) => {
    Comment.findById(req.params.commentId, (err, comment) => {
        if (err || !comment) {
            res.send({ status: 404, response: "Something went wrong!!" });
        }
        else {
            comment.likes.push(req.user._id);
            comment.save();
            if (!comment.author.id.equals(req.user._id)) {
                Campground.findById(req.params.id, (err, campground) => {
                    if (err || !campground) {
                        console.log("Some error occured");
                    }
                    else {
                        let obj = {};
                        obj.type = 4;
                        obj.post = {};
                        obj.post.name = campground.name;
                        obj.post.id = campground._id;
                        obj.notificationFor = comment.author.id;
                        obj.notificationBy = req.user._id;
                        Notif.create(obj, (err, notif) => {
                            // console.log(notif);
                        });
                    }
                });
            }
            res.send({ status: 200, response: " Post liked succesfully", count: comment.likes.length });
        }
    });
});

route.post('/:commentId/unlike', middleware.isAuthenticated, (req, res) => {
    Comment.findById(req.params.commentId, (err, comment) => {
        if (err || !comment) {
            res.send({ status: 404, response: "Something went wrong!!" });
        }
        else {
            let index = comment.likes.indexOf(req.user._id);
            comment.likes.splice(index, 1);
            comment.save();
            res.send({ status: 200, response: " Post liked succesfully", count: comment.likes.length });
        }
    });
});


module.exports = { route };
