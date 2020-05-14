var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user.js");
var middleware = require("../middleware");
router.get("/", function(req, res){
    res.render("landing");
});
// Register Form
router.get("/register", function(req, res){
    res.render("register");
});
// Register Logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    var password = req.body.password;
    User.register(newUser, password, function(err, user){
        if(err){
            return res.render("register", {"error": err.message});
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to YelpCamp, " + req.user.username);
            res.redirect("/campgrounds");
        });

    });
});
// Login Logic
router.get("/login", function(req, res){
    res.render("login");
});
// Login Logic
router.post("/login", passport.authenticate("local", {
        successRedirect: "/campgrounds",
        successFlash: "Welcome Back to YelpCamp",
        failureRedirect: "/login",
        failureFlash: "Invalid Username or Password."
    })
);
// Logout route
router.get("/logout", middleware.isLoggedIn, function(req, res){
    req.logout();
    req.flash("error", "You logged out successfully.");
    res.redirect("/campgrounds");
});

module.exports = router;