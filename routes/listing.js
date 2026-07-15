const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");

const Listing = require("../models/listing.js");
const passport=require("passport");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const listingController=require("../controllers/listing.js");
const multer  = require('multer');
const {storage}=require("../cloudconfig.js");
const upload = multer({ storage });




router.route("/")

.get( wrapAsync(listingController.index))

.post(isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync(listingController.createListing));




router.get("/new", isLoggedIn,listingController.rendernewForm);


router.route("/:id")

.get(wrapAsync(listingController.showListing))

.put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingController.renderupdatedListing))

.delete(isLoggedIn,isOwner,wrapAsync(listingController.renderdeleteListing));




router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.rendereditedListing));



module.exports=router;