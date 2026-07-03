const Listing=require("../models/listing.js");

async function geocodeLocation(location) {
    const defaultCoordinates = [77.2090, 28.6139];

    if (!location || typeof location !== "string" || location.trim() === "") {
        return defaultCoordinates;
    }

    const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(location.trim())}`;

    const response = await fetch(geocodeUrl, {
        headers: {
            "User-Agent": "WanderlustApp/1.0",
            "Accept-Language": "en"
        }
    });

    if (!response.ok) {
        throw new Error(`Nominatim geocoding failed with status ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
        return defaultCoordinates;
    }

    const lon = parseFloat(data[0].lon);
    const lat = parseFloat(data[0].lat);

    if (!Number.isFinite(lon) || !Number.isFinite(lat)) {
        return defaultCoordinates;
    }

    return [lon, lat];
}

module.exports.index=async(req,res)=>{ 
    try {
        const allListings=await Listing.find({});
        res.render("listings/index",{allListings});
    } catch(err) {
        console.log(err);
        res.status(500).send("Error fetching listings");
    }
};


module.exports.rendernewForm=(req,res)=>{
  
    res.render("listings/new.ejs");
}



module.exports.showListing=(async (req,res)=>{//wrapAsync is a function that takes a function as an argument and returns a new function that catches any error thrown by the original function and passes it to the next middleware which is the error handling middleware
     let {id} = req.params;
     const listing= await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
     if(!listing){
         req.flash("error", "Listing not found!");
         return res.redirect("/listings"); 
     }
     console.log(listing);
     res.render("listings/show.ejs",{listing});
});


module.exports.createListing=(async(req,res,next)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"Invalid Listing Data");
    }
    
    let coordinates = [77.2090, 28.6139]; // Default to New Delhi coordinates
    try {
        coordinates = await geocodeLocation(req.body.listing.location);
    } catch(err) {
        console.error("Geocoding error during create:", err);
    }

    const newListing=new Listing(req.body.listing);//req.body.listing is the data from the form and Listing is the model we created
    newListing.owner=req.user._id;
    newListing.geometry = {
        type: "Point",
        coordinates: coordinates
    };
    
    if(typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        newListing.image = {url, filename};
    }

    await newListing.save();
    req.flash("success", "Successfully made a new listing!");
    console.log(newListing);
    res.redirect("/listings"); 
}
);


module.exports.renderupdatedListing=(async(req,res,next)=>{
    let {id}=req.params;
    
    let coordinates = [77.2090, 28.6139];
    let geocodedSuccessfully = false;
    try {
        coordinates = await geocodeLocation(req.body.listing.location);
        geocodedSuccessfully = true;
    } catch(err) {
        console.error("Geocoding error during update:", err);
    }

    let listing=await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true, runValidators: true });

    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    if (geocodedSuccessfully) {
        listing.geometry = {
            type: "Point",
            coordinates: coordinates
        };
    }

    if(typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
    }

    await listing.save();
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
});



module.exports.rendereditedListing=(async(req,res)=>{
let {id}=req.params;
const listing= await Listing.findById(id);
if(!listing){
         req.flash("error", "Listing not found!");
         res.redirect("/listings"); 
     }
    res.render("listings/edit.ejs",{listing}); //we are passing the listings to edit.ejs and it takes template , makes htm
});


module.exports.renderdeleteListing=(async(req,res,next)=>{
let {id}=req.params;
let deletedListing=await Listing.findByIdAndDelete(id);
console.log(deletedListing);
req.flash("success", "Listing Deleted!");
res.redirect("/listings");
})

module.exports.geocodeLocation = geocodeLocation;