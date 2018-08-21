let express             = require('express'),
app                     = express(),
bodyParser              = require('body-parser'),
mongoose                = require('mongoose'),
passport                = require('passport'),
passportLocalMongoose   = require('passport-local-mongoose'),
localStrategy           = require('passport-local'),
flash                   = require('connect-flash')
Campground              = require('./models/campgrounds'),
Comment                 = require("./models/comment"),
User                    = require('./models/user'),
seedDb                  = require('./seeds'),
methodOverride          = require('method-override'),
routes                  = require('./routes');


mongoose.connect("mongodb://localhost:27017/yelpcamp_db", { useNewUrlParser: true });

app.locals.moment = require('moment');
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'))
app.use(flash());
// seedDb();

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
    // console.log(req.user);
    res.locals.currentUser = req.user; 
    res.locals.error = req.flash("error");
    res.locals.message = req.flash("success");
    next();
});


app.use(routes.route);


app.listen(3001,() => {console.log("server listening at 3000")})