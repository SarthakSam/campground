const route = require('express').Router();
let Campground = require('../models/campgrounds'),
middleware = require('../middleware');

route.get('/',(req,res) => {
    Campground.find({},function(error,campgrounds){
        if(error){
            console.log("Some error occured");
        }
        else{
            res.render('campgrounds/index',{ info: campgrounds});
        }
  });
})

route.post('/',middleware.isAuthenticated,(req,res) => {
    let name= req.body.name, image= req.body.imageURL, info= req.body.info;
    let obj = { name: name , image: image , info: info, postedBy: { username: req.user.username, id: req.user._id}};

    Campground.create(obj,function(error,newCampground){
            if(error)
                 console.log("Some error occured");
            else{
                //  console.log(newCampground);        
            }
    });
    res.redirect('/campgrounds');
});

route.get('/new',middleware.isAuthenticated,(req,res) => {
    res.render('campgrounds/new');
});

route.get('/:id',(req,res) => {
    // console.log(req.params.id);
    Campground.find({},function(error,campgrounds){
        if(error){
            console.log("Some error occured");
        }
        else{
        //    console.log(campgrounds);
        }
  });
      Campground.findById(req.params.id).populate("comments").exec(function(error,campground){
          if(error)
                console.log("Some error occured");
          else{
            res.render('campgrounds/show',{ campground });
          }
              
      });
});

route.get('/:id/edit',middleware.isAuthenticated,middleware.isUserAndCreatorSame,(req,res) => {
    campground = res.campground;
    res.render('campgrounds/edit', campground);
});

route.put('/:id',middleware.isAuthenticated,middleware.isUserAndCreatorSame,(req,res) => {
    let id = req.params.id,
        campground = req.body.campground;
    Campground.findByIdAndUpdate(id,campground,(err,updatedCampground) => {
        if(err){
            console.log(err);
        }
        else{
            // console.log(updatedCampground);
        }
        res.redirect('/campgrounds/'+id);
    });
});

route.delete('/:id',middleware.isAuthenticated,middleware.isUserAndCreatorSame,(req,res) => {
    let id = req.params.id;
    Campground.findByIdAndRemove(id,(err) => {
        if(err){
            console.log(err);
        }
        else{
            console.log("campground deleted");
        }
        res.redirect('/campgrounds/');
    });
});






module.exports = { route };