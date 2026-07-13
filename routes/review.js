const express=require("express");
const router=express.Router({mergeParams:true});  
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {isLoggedIn,isOwner,isReviewAuthor,validateListing,validateReview}=require("../middleware.js")

const Listing = require("../models/listing.js");
const Review=require("../models/review.js");
const reviewController=require("../controllers/review.js");


router.post("/",validateReview,isLoggedIn,wrapAsync(reviewController.createReview));



router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReview));

module.exports=router;
