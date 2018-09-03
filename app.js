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
nodemailer              = require('nodemailer');
routes                  = require('./routes'),
bcrypt                  = require('bcrypt-nodejs'),
async                   = require('async'),
crypto                  = require('crypto'),
expressSanitizer        = require('express-sanitizer');


mongoose.connect("mongodb://localhost:27017/postit_db", { useNewUrlParser: true });
// mongoose.connect("mongodb://"+process.env.Mlab_user+":"+process.env.Mlab_pass+"@ds141872.mlab.com:41872/postit", { useNewUrlParser: true }); 


app.locals.moment = require('moment');
app.use(expressSanitizer());
app.set('views', __dirname + '/views');
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'))
app.use(flash());
require('dotenv').config();
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


app.set('port',process.env.PORT || 3000)
app.listen(app.get('port'), function(err) {

    if (!err)
        console.log("Server started at localhost:3000");
    else {
        console.log("server not listening")
        console.log(err)
    }
});
