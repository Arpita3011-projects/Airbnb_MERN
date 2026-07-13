const Listing=require("./models/listing");
const Review=require("./models/review.js");
const ExpressError=require("./utils/ExpressError.js");
const { validateListingBody, validateReviewBody } = require("./utils/listingValidation.js");





module.exports.validateListing=(req,res,next)=>{
    const { error } = validateListingBody(req.body);
    if (error) {
        const errmsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errmsg);
    }
    next();
}


module.exports.validateReview=(req,res,next)=>{
    const { error } = validateReviewBody(req.body);
    if (error){
        const errmsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errmsg);
    }
    next();
}



module.exports.isLoggedIn=((req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","Login required!");
        return res.redirect("/login");
    }
    next();
});

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner=async(req,res,next)=>{
    const {id}=req.params;
    const listing=await Listing.findById(id);
    // If listing not found just redirect
    if(!listing){
        req.flash("error","Listing not found!");
        return res.redirect("/listings");
    }
    if(!listing.owner.equals(req.user._id)){
        req.flash("error","Only post owner can perform this action!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.isReviewAuthor=async(req,res,next)=>{
    const {id,reviewId}=req.params;
    const review=await Review.findById(reviewId);
    if(!review){
        req.flash("error","Review not found!");
        return res.redirect(`/listings/${id}`);
    }
    if(!review.author.equals(req.user._id)){
        req.flash("error","Only review owner can perform this action!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};


