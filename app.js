var express             = require("express"),
    app                 = express(),
    bodyParser          = require("body-parser"),
    mongoose            = require("mongoose"),
    passport            = require("passport"),
    LocalStrategy       = require("passport-local"),
    methodOverride      = require("method-override"),
    flash               = require("connect-flash"),
    Campground          = require("./models/campground.js"),
    seedDB              = require("./seeds.js"),
    Comment             = require("./models/comment"),
    User                = require("./models/user"),
    //Requiring Routes
    commentRoutes       = require("./routes/comments"),
    campgroundRoutes    = require("./routes/campgrounds.js"),
    indexRoutes         = require("./routes/index.js")
;
// seedDB();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect("mongodb+srv://mmostafa:moha231@cluster0-yupjf.mongodb.net/test?retryWrites=true&w=majority", {
useUnifiedTopology: true,
useNewUrlParser: true,
useFindAndModify: false
});
app.use(methodOverride("_method"))
app.use(express.static(__dirname + "/public"));
app.use(flash());
//===============
//PASSPORT CONFIG
//===============
app.use(require("express-session")({
    secret: "Anything that i want",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser  = req.user;
    res.locals.error        = req.flash("error");
    res.locals.success      = req.flash("success");
    next();
});
app.use(indexRoutes);
app.use("/campgrounds/", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
function serverStarted(){
    console.log("Server Started 1Successfully!!");
}
var port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
app.listen(port, serverStarted);    