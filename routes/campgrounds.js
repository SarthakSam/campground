const route = require('express').Router();
let Campground = require('../models/campgrounds');

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

route.post('/',(req,res) => {
    // console.log("u posted");
    let name= req.body.name, image= req.body.imageURL, info= req.body.info;
    let obj = { name: name , image: image , info: info};

    Campground.create(obj,function(error,newCampground){
            if(error)
                 console.log("Some error occured");
            else
                 console.log(newCampground);     
    });
    res.redirect('/campgrounds');
});

route.get('/new',(req,res) => {
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


module.exports = { route };