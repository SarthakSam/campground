let express             = require('express'),
app                     = express(),
bodyParser              = require('body-parser'),
mongoose                = require('mongoose'),
passport                = require('passport'),
passportLocalMongoose   = require('passport-local-mongoose'),
localStrategy           = require('passport-local')
Campground              = require('./models/campgrounds'),
Comment                 = require("./models/comment"),
User                    = require('./models/user'),
seedDb                  = require('./seeds');

mongoose.connect("mongodb://localhost:27017/yelpcamp_db", { useNewUrlParser: true });

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true }));
app.use(express.static(__dirname + '/public'));
seedDb();

// PASSPORT CONFIGURATION

app.use(require('express-session')({
    secret:  "node is the best",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    console.log(req.user);
    res.locals.currentUser = req.user; 
    next();
});




//ROUTES

app.get('/',(req,res) => {
    res.render('homepage');
})

app.get('/campgrounds',(req,res) => {
    Campground.find({},function(error,campgrounds){
        if(error){
            console.log("Some error occured");
        }
        else{
            res.render('campgrounds/index',{ info: campgrounds});
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
    res.render('campgrounds/new');
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
            res.render('campgrounds/show',{ campground });
          }
              
      });
});

// ==========================
//    COMMENTS ROUTES
//==========================


app.get('/campgrounds/:id/comments/new',isAuthenticated,(req,res) => {
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
    

app.post('/campgrounds/:id/comments',isAuthenticated,(req,res) => {
   Campground.findById(req.params.id, (error,campground) => {
            if(error)
                console.log(error);
            else{
                Comment.create(req.body.comment, (err,comment) => {
                      if(err)
                          console.log(err);
                      else{
                          campground.comments.push(comment);
                          campground.save();
                          res.redirect('/campgrounds/'+req.params.id);
                      } 
                });
            }    
   });
});


//======================
//  AUTHENTICATION ROUTES
//======================

app.get('/signup',(req,res) => {
        res.render('users/signup');
});

app.post('/signup',(req,res) => {
    User.register(new User({email: req.body.email, username: req.body.username}),req.body.password,function(err,user){
            if(err){
                console.log(err);
                res.redirect('/signup');
            }
            else{
                passport.authenticate('local')(req,res,function(){
                    res.redirect('/campgrounds');
                });
            }
    });
});

app.get('/signin',(req,res) => {
    res.render('users/signin');
});

app.post('/signin',passport.authenticate('local',{
    successRedirect: '/campgrounds',
    failureRedirect: '/signin'
}),(req,res) => {   
});


app.get('/signout',(req,res) => {
     req.logout();
     res.redirect('/campgrounds');
});


function isAuthenticated(req,res,next){
    if(req.isAuthenticated())
      return next();
      res.redirect('/signin');
}



app.listen(3000,() => {console.log("server listening at 3000")})