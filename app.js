let express  = require('express'),
app          = express(),
bodyParser   = require('body-parser'),
mongoose     = require('mongoose'),
Campground   = require('./models/campgrounds'),
Comment      = require("./models/comment"),
seedDb       = require('./seeds');

mongoose.connect("mongodb://localhost:27017/yelpcamp_db", { useNewUrlParser: true });

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true }));

seedDb();

app.get('/',(req,res) => {
    res.render('homepage');
})

app.get('/campgrounds',(req,res) => {
    Campground.find({},function(error,campgrounds){
        if(error){
            console.log("Some error occured");
        }
        else{
            res.render('index',{ info: campgrounds});
        }
  });
})

app.post('/campgrounds',(req,res) => {
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

app.get('/campgrounds/new',(req,res) => {
    res.render('new');
});

app.get('/campgrounds/:id',(req,res) => {
    // console.log(req.params.id);
    Campground.find({},function(error,campgrounds){
        if(error){
            console.log("Some error occured");
        }
        else{
           console.log(campgrounds);
        }
  });
      Campground.findById(req.params.id).populate("comments").exec(function(error,campground){
          if(error)
                console.log("Some error occured");
          else{
              console.log(campground);
            res.render('show',{ campground });
          }
              
      });
});

app.listen(3000,() => {console.log("server listening at 3000")})