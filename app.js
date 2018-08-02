let express = require('express'),
app = express(),
bodyParser = require('body-parser'),
mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/yelpcamp_db", { useNewUrlParser: true });

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true }));

let campgroundsSchema = new mongoose.Schema({
    name: String,
    image: String,
    info: String
});

let Campground = mongoose.model("Campground",campgroundsSchema);


let array=[
    {name: "triund", image: "https://imageresizer.static9.net.au/ajXtWFyJjoZov19NQGzpSOXP0MU=/1024x0/http%3A%2F%2Fprod.static9.net.au%2F_%2Fmedia%2FNetwork%2FImages%2F2017%2F02%2F03%2F11%2F03%2Fcamping-sleep-cycle.jpg"},
    {name: "kheerganga", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbzgaL4sTtXWHyGEcfE7qKhCRDwCL2oUDvG_ivNqPD0q45qnO0Ig"},
    {name: "kailash", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4n4B92xczlVSFhBXQBTPDId6i5Inv6bYBvOWngXIYZKEseouw0g"},
    {name: "triund", image: "https://imageresizer.static9.net.au/ajXtWFyJjoZov19NQGzpSOXP0MU=/1024x0/http%3A%2F%2Fprod.static9.net.au%2F_%2Fmedia%2FNetwork%2FImages%2F2017%2F02%2F03%2F11%2F03%2Fcamping-sleep-cycle.jpg"},
    {name: "kheerganga", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbzgaL4sTtXWHyGEcfE7qKhCRDwCL2oUDvG_ivNqPD0q45qnO0Ig"},
    {name: "kailash", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4n4B92xczlVSFhBXQBTPDId6i5Inv6bYBvOWngXIYZKEseouw0g"}        
]

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
      Campground.findById(req.params.id,function(error,campground){
          if(error)
                console.log("Some error occured");
          else
                res.render('show',{ campground });
      });
});

app.listen(3000,() => {console.log("server listening at 3000")})