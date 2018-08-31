const route = require('express').Router();
let Campground = require('../models/campgrounds'),
    multer     = require('../middleware/multer'),
    middleware = require('../middleware');


route.get('/', (req, res) => {
    // eval(require('locus'));
    let perPage = 6,
        pageQuery = parseInt(req.query.page),
        pageNumber = pageQuery ? pageQuery : 1;

    if(req.query.searchQuery){
        const regex = new RegExp(escapeRegex(req.query.searchQuery), 'gi');
        // Campground.find({ $or: [
        //     {name: regex},
        //     {"postedBy.username": regex}
        // ]}, function (error, campgrounds) {
        //     if (error) {
        //         console.log("Some error occured while fetching all campgrounds");
        //     }
        //     else {
        //         res.render('campgrounds/index', { info: campgrounds, page: "home" });
        //     }
        // });  

        //Could have also used mongoose-paginate
        Campground.find({$or: [
                {name: regex},
                {"postedBy.username": regex}
            ]}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, allCampgrounds) {
            Campground.find({$or: [{name: regex},{"postedBy.username": regex}]}).countDocuments().exec(function (err, count) {
                if (err) {
                    console.log(err);
                } else {
                    res.render("campgrounds/index", {
                        info: allCampgrounds,
                        searchMade: true,
                        current: pageNumber,
                        pages: Math.ceil(count / perPage),
                        page: "home"
                    });
                }
            });
        });
    }
    else{
        Campground.find({}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, allCampgrounds) {
            Campground.countDocuments().exec(function (err, count) {
                if (err) {
                    console.log(err);
                } else {
                    res.render("campgrounds/index", {
                        info: allCampgrounds,
                        searchMade: false,
                        current: pageNumber,
                        pages: Math.ceil(count / perPage),
                        page: "home"
                    });
                }
            });
        });  
    }
});

route.post('/', middleware.isAuthenticated,multer.upload.single('image'),(req, res) => {
    let name = req.body.name, image = req.body.imageURL, info = req.sanitize(req.body.info) , price = req.body.price;
    if(!image){
        image = 'https://res.cloudinary.com/bvcoe/image/upload/v1534844604/noimage.png';
    }
    let obj = { name: name, image: image, info: info, price: price, postedBy: { username: req.user.username, id: req.user._id } };
    if(req.file){
        multer.cloudinary.uploader.upload(req.file.path, function(result) {
            // add cloudinary url for the image to the campground object under image property
            obj.image = result.secure_url;
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
    }
    else{
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
    }
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
          const dir = '/uploads';  
          let profileImage = dir+"/profilePicture.jpg";
            res.render('campgrounds/show', { campground, profileImage });
        }

    });
});

route.get('/:id/edit', middleware.isAuthenticated, middleware.isUserAndCreatorSame, (req, res) => {
    campground = res.campground;
    res.render('campgrounds/edit', campground);
});

route.put('/:id', middleware.isAuthenticated, middleware.isUserAndCreatorSame,multer.upload.single('image'), (req, res) => {
    req.body.campground.info = req.sanitize(req.body.campground.info);
    let id = req.params.id,
        campground = req.body.campground;
        if(req.body.imageURL)
        campground.image = req.body.imageURL;
        if(req.file){
            multer.cloudinary.uploader.upload(req.file.path, function(result) {
                // add cloudinary url for the image to the campground object under image property
                campground.image = result.secure_url;
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
        }
        else{
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
        }
});

route.delete('/:id', middleware.isAuthenticated, middleware.isUserAndCreatorSame, (req, res) => {
    let id = req.params.id;
    Campground.findById(id,function(err,campground){
        if(err||!campground){
            req.flash('no such campground found');
            res.redirect('back');
        }
        else{
            if(campground.image&&campground.image!='https://res.cloudinary.com/bvcoe/image/upload/v1534844604/noimage.png'&&campground.image.includes("cloudinary")){
                let str = campground.image;
                multer.cloudinary.v2.uploader.destroy(str.substring(str.lastIndexOf('/')+1,str.lastIndexOf('.')), function(error, result){console.log(result, error)});
            }
        }
    });
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

route.post('/:id/location',middleware.ajaxIsAuthenticated,middleware.ajaxIsUserAndCreatorSame, (req, res) => {
    let obj = {
        location: req.body.location,
        navigationPosition: req.body.coordinates
    };
    Campground.findByIdAndUpdate(req.params.id, obj, (error, updatedCampground) => {
        if (error||!updatedCampground) {
            console.log(error);
            res.send("unable to add location to database");
        }
         else {
             console.log("location added successfully")
             req.flash("success","location added successfully");
                res.send("location added successfully")
            }
    });
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};


module.exports = { route };