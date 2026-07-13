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
//index route - create a route to show all listings
.get( wrapAsync(listingController.index))
//create route - create a route to create a new listing and save it to the database
.post(isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync(listingController.createListing));



//new route - create a route to show a form to create a new listing
router.get("/new", isLoggedIn,listingController.rendernewForm);


router.route("/:id")
//show route - create a route to show a single listing
.get(wrapAsync(listingController.showListing))
//update route - create a route to update a listing ,saves the updated data to the database and redirects to the show page of the updated listing
.put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingController.renderupdatedListing))
//delete route - create a route to delete a listing from the database and redirects to the index page
.delete(isLoggedIn,isOwner,wrapAsync(listingController.renderdeleteListing));



//edit route - create a route to fetch the added daya from db and show a form to edit a listing
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.rendereditedListing));



module.exports=router;