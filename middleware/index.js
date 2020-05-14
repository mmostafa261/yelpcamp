var Campground = require("../models/campground.js");
var Comment = require("../models/comment.js");
var middlewareObj = {
};

middlewareObj.checkCampgroundOwnerShip = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                req.flash("error", "An Error has occured, Please try again later.");
                res.redirect("/campgrounds");
            }else{
                if(foundCampground.author._id.equals(req.user._id)){
                    next();
                }else {
                    req.flash("error", "You don't have permisson to do that.")
                    res.redirect("/campgrounds/" + req.params.id);
                }
            }
        });
    }
    else {        
        req.flash("error", "You must be logged in to do that.");
        res.redirect("/login");
    }
}
middlewareObj.checkCommentOwnerShip = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.commentid, function(err, foundComment){
            if(err){
                req.flash("error", "An Error has occured, Please try again later.");
                res.redirect("/campgrounds");
            }
            else{
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                }
                else {
                    req.flash("error", "You don't have permisson to do that.")
                    res.redirect("/campgrounds/" + req.params.id);
                }
            }
        });
    }
    else {        
        req.flash("error", "You must be logged in to do that.");
        res.redirect("/login");
    }
}
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You must be logged in to do that");
    res.redirect("/login");
}

    
module.exports = middlewareObj;