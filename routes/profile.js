const route = require('express').Router();
let User = require('../models/user'),
    Campground = require('../models/campgrounds'),
    middleware = require('../middleware'),
    multer = require('../middleware/multer');


route.get('/:id', middleware.isAuthenticated, (req, res) => {
    User.findById(req.params.id, (err, user) => {
        if (err || !user) {
            req.flash("No such User");
            res.redirect('/campgrounds');
        }
        else {
            Campground.find({}).where('postedBy.id').equals(req.params.id).exec(function (err, campgrounds) {
                if (err) {
                    req.flash("error", "Something went wrong!!!!");
                    res.redirect("back");
                }
                else {
                    res.render('users/profile', { page: "profile", usercampgrounds: campgrounds, profileOfUser: user });
                }
            });

        }
    });

});

route.get('/:id/edit', middleware.isAuthenticated, (req, res) => {
    if (req.user._id.equals(req.params.id))
        res.render('users/edit');
    else {
        req.flash("error", "You are not authorised to edit someone's else profile");
        res.redirect('/profile/' + req.params.id);
    }
});

route.put('/:id', middleware.isAuthenticated, (req, res) => {
    if (!req.body.user.email) {
        req.body.user.email = req.user.email;
    }
    User.findByIdAndUpdate(req.user._id, req.body.user, (err) => {
        if (err) {
            req.flash("error", "Unable to update profile info");
        }
        else {
            req.flash("success", "Profile Info Updated successfully!!!");
        }
        res.redirect('/profile/' + req.params.id);
    });
});

route.put('/:id/upload/:choice', middleware.isAuthenticated, multer.upload.single('image'), (req, res) => {
    if (!req.user._id.equals(req.params.id)) {
        req.flash("error", "You are not authorised to edit someone's else profile");
        res.redirect('/profile/' + req.params.id);
    }
    else {
        if (req.file) {
            multer.cloudinary.uploader.upload(req.file.path, function (result) {
                if (!result) {
                    req.flash("error", "unable to upload photo");
                    res.redirect('/profile/' + req.params.id);
                }
                else {
                    User.findById(req.user._id, (err, user) => {
                        if (err || !user) {
                            console.log("unable to find user");
                            req.flash("error", "Unable to find user");
                        }
                        else {
                            let str;
                            if (req.params.choice == 1) {
                                str = "coverphoto";
                            }
                            else {
                                str = "profilephoto";
                            }
                            if (user[str] && user[str].includes("cloudinary")) {
                                multer.cloudinary.v2.uploader.destroy(user[str].substring(user[str].lastIndexOf('/') + 1, user[str].lastIndexOf('.')), function (error, result) { console.log(result, error) });
                            }
                            req.flash("success", "Photo uploaded successfully");
                            user[str] = result.secure_url;
                            console.log(user);
                            user.save();
                        }
                        res.redirect('/profile/' + req.params.id);
                    });
                }
            });
        }
        else {
            req.flash("error", "File not recieved");
            res.redirect("'/profile/' + req.params.id");
        }

    }
});



module.exports = { route }  