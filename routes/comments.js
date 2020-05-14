var express = require("express");
var router = express.Router({mergeParams: true});
var User = require("../models/user.js");
var Campground = require("../models/campground");
var Comment = require("../models/comment.js");
var middleware = require("../middleware");
//Comments New
router.get("/new", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {campground: campground});
        }
    })
    
});

//Comments Create
router.post("/", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }
        else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error", "An Error has occured, Please try again later.");
                    res.redirect("back");
                }else{
                    comment.author = {
                        username: req.user.username,
                        id: req.user._id
                    };
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Successfully added the comment.");
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});
router.get("/:commentid/edit", middleware.checkCommentOwnerShip, function(req, res){
    Comment.findById(req.params.commentid, function(err, foundComment){
        if(err){
            req.flash("error", "An Error has occured, Please try again later.");
            res.redirect("back");
        }
        else{
            res.render("comments/edit", {campground: req.params.id, comment: foundComment});
        }
    });
});
router.put("/:commentid", middleware.checkCommentOwnerShip, function(req, res){
    Comment.findByIdAndUpdate(req.params.commentid, {text: req.body.text}, function(err, updatedCampground){
        if(err){
            req.flash("error", "An Error has occured, Please try again later.");
            res.redirect("back");
        }else{
            req.flash("success", "Successfully Edited The Campgrounds");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
})
router.delete("/:commentid", middleware.checkCommentOwnerShip, function(req, res){
    console.log(req.params.commentid);
    Comment.findByIdAndRemove(req.params.commentid, function(err){
        if(err){
            req.flash("error", "An Error has occured, Please try again later.");
            res.redirect("back");
        }else{
            req.flash("success", "Successfully Deleted.")
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});


module.exports = router;