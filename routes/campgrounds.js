const route = require('express').Router();
let Campground = require('../models/campgrounds'),
    middleware = require('../middleware');


route.get('/', (req, res) => {
    Campground.find({}, function (error, campgrounds) {
        if (error) {
            console.log("Some error occured while fetching all campgrounds");
        }
        else {
            res.render('campgrounds/index', { info: campgrounds });
        }
    });
})

route.post('/', middleware.isAuthenticated, (req, res) => {
    let name = req.body.name, image = req.body.imageURL, info = req.body.info, price = req.body.price;
    let obj = { name: name, image: image, info: info, price: price, postedBy: { username: req.user.username, id: req.user._id } };

    Campground.create(obj, function (error, newCampground) {
        if (error) {
            console.log(err);
            req.flash("error", "Unable to create new Campground");
        }
        else {
            req.flash("success", "Created new Campground");
        }
        res.redirect('/campgrounds');
    });
});

route.get('/new', middleware.isAuthenticated, (req, res) => {
    res.render('campgrounds/new');
});

route.get('/:id', (req, res) => {
    Campground.findById(req.params.id).populate("comments").exec(function (error, campground) {
        if (error || !campground) {
            console.log("Some error occured in getting campground/id");
            req.flash("error", "unable to load campground");
            res.redirect('/campgrounds');
        }
        else {
            res.render('campgrounds/show', { campground });
        }

    });
});

route.get('/:id/edit', middleware.isAuthenticated, middleware.isUserAndCreatorSame, (req, res) => {
    campground = res.campground;
    res.render('campgrounds/edit', campground);
});

route.put('/:id', middleware.isAuthenticated, middleware.isUserAndCreatorSame, (req, res) => {
    let id = req.params.id,
        campground = req.body.campground;
    Campground.findByIdAndUpdate(id, campground, (err, updatedCampground) => {
        if (err) {
            console.log(err);
            req.flash("error", "Unable to edit campground");
        }
        else {
            req.flash("success", "Campground edited sucessfully");
        }
        res.redirect('/campgrounds/' + id);
    });
});

route.delete('/:id', middleware.isAuthenticated, middleware.isUserAndCreatorSame, (req, res) => {
    let id = req.params.id;
    Campground.findByIdAndRemove(id, (err) => {
        if (err) {
            console.log(err);
            req.flash("error", "Unable to delete campground");
        }
        else {
            req.flash("success", "Campground deleted sucessfully");
        }
        res.redirect('/campgrounds/');
    });
});

route.get('/:id/location',(req,res) => {
    Campground.findById(req.params.id,(error, campground) => {
        if (error || !campground) {
            console.log("Some error occured while fetching location");
            res.send({message: "no such campground", status: 404 });
        }
        else {
               if(campground.navigationPosition) 
               res.send({location: campground.location , coordinates: campground.navigationPosition ,status: 200}); 
               else
               res.send({message: "no location given by user",status: 201});
            }
    });
});

route.post('/:id/location', (req, res) => {
    let obj = {
        location: req.body.location,
        navigationPosition: req.body.coordinates
    };
    Campground.findByIdAndUpdate(req.params.id, obj, (error, updatedCampground) => {
        if (error) {
            console.log(error);
            res.send("unable to add location to database");
        }
         else {
             console.log("location added successfully")
                res.send("location added successfully")
            }
    });
});

module.exports = { route };