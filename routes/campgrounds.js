var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user.js");
var Campground = require("../models/campground");
var Comment = require("../models/comment.js");
var middleware = require("../middleware");
// INDEX
router.get("/", function(req, res){
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            req.flash("error", "An Error has occured, Please try again later.");
            res.redirect("back");
        }
        else{
            // res.send("test");
            res.render("campgrounds/index", {campgrounds:allCampgrounds}); 
        }
    });
});  
//NEW
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
})
//CREATE
router.post("/", middleware.isLoggedIn, function(req, res){
    var camp = {
        name: req.body.name,
        image: req.body.image,
        price: req.body.price,
        description: req.body.description,
        author : {
            id: req.user._id,
            username: req.user.username
        }
    };
    //Create a new campground and save to DB
    Campground.create(camp, function(err, newlyCreated){
        if(err){
            req.flash("error", "An Error has occured, Please try again later.");
            res.redirect("back");
        }
        else{
            req.flash("success", "Successfully created the campground.");
            res.redirect("/campgrounds");
        }
    });
});
//SHOW
router.get("/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            req.flash("error", "An Error has occured, Please try again later.");
            res.redirect("back");
        } else {
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});
//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnerShip, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});
//UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnerShip, function(req, res){
    var data = {
        name: req.body.name,
        image: req.body.image,
        description: req.body.description,
        price: req.body.price
    };
    Campground.findByIdAndUpdate(req.params.id, data, function(err, updatedCampground){
        if(err){
            req.flash("error", "An Error has occured, Please try again later.");
            res.redirect("/campgrounds");
        }else{
            req.flash("success", "Successfully Edited The Campgrounds");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});
router.delete("/:id", middleware.checkCampgroundOwnerShip, function(req, res){
    Campground.findOneAndRemove(req.params.id, function(err){
        if(err){
            req.flash("error", "An Error has occured, Please try again later.");
            res.redirect("back");
        }else{
            req.flash("success", "Successfully Deleted.")
            res.redirect("/campgrounds");
        }
    });
});
module.exports = router;