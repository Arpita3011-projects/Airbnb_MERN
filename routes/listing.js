const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const {listingSchema} = require("../views/listings/schema.js");
const ExpressError=require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {reviewSchema} = require("../views/listings/schema.js");




const validateListing=(req,res,next)=>{
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const errmsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errmsg);
    } else {
        next();
    }
}

//index route - create a route to show all listings
router.get("/", wrapAsync(async(req,res)=>{ // /listings is replaced by / because of router object usage cuz we defined listings usage in app.js and migrated listings to listings.js so no need to mention listings everywhere
    try {
        const allListings=await Listing.find({});
        res.render("listings/index",{allListings});
    } catch(err) {
        console.log(err);
        res.status(500).send("Error fetching listings");
    }
}));


//new route - create a route to show a form to create a new listing
router.get("/new", (req,res)=>{
    res.render("listings/new.ejs");
});


//show route - create a route to show a single listing
router.get("/:id", wrapAsync(async (req,res)=>{//wrapAsync is a function that takes a function as an argument and returns a new function that catches any error thrown by the original function and passes it to the next middleware which is the error handling middleware
     let {id} = req.params;
     const listing= await Listing.findById(id).populate("reviews");
     res.render("listings/show.ejs",{listing});
}));

//create route - create a route to create a new listing and save it to the database
router.post("/",validateListing,wrapAsync(async(req,res,next)=>{
    
    if(!req.body.listing){
        throw new ExpressError(400,"Invalid Listing Data");
    }    // const price = req.body.listing?.price;
        // if (price !== undefined && price !== "" && isNaN(price)) {
        //     throw new ExpressError(400, "Price must be a number");
        // }
        const newListing=new Listing(req.body.listing);//req.body.listing is the data from the form and Listing is the model we created
        await newListing.save();
        console.log(newListing);
        res.redirect("/listings"); 
}
));


//update route - create a route to update a listing ,saves the updated data to the database and redirects to the show page of the updated listing
router.put("/:id",validateListing,wrapAsync(async(req,res,next)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id, req.body.listing);
    res.redirect(`/listings/${id}`);
}));


//edit route - create a route to fetch the added daya from db and show a form to edit a listing
router.get("/:id/edit",wrapAsync(async(req,res)=>{
let {id}=req.params;
const listing= await Listing.findById(id);
res.render("listings/edit.ejs",{listing}); //we are passing the listings to edit.ejs and it takes template , makes htm
}));

//delete route - create a route to delete a listing from the database and redirects to the index page
router.delete("/:id",wrapAsync(async(req,res,next)=>{
let {id}=req.params;
let deletedListing=await Listing.findByIdAndDelete(id);
console.log(deletedListing);
res.redirect("/");
}));







module.exports=router;