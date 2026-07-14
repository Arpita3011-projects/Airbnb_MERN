const mongoose = require("mongoose");
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

module.exports.index = async (req, res) => {
    try {
        const count = await Listing.countDocuments();
        const allListings = await Listing.find({});
        res.json({ allListings });

    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching listings");
    }
};

module.exports.rendernewForm=(req,res)=>{
    res.json({ listing: null });
}

module.exports.showListing=(async (req,res)=>{
     let {id} = req.params;
     const listing= await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
     if(!listing){
         req.flash("error", "Listing not found!");
         return res.redirect("/listings"); 
     }
    
     res.json({ listing });
});

module.exports.createListing=(async(req,res,next)=>{
    if(!req.body.listing){
        throw new (require("../utils/ExpressError.js"))(400,"Invalid Listing Data");
    }

    let coordinates = [77.2090, 28.6139];
    try {
        coordinates = await geocodeLocation(req.body.listing.location);
    } catch(err) {
        console.error("Geocoding error during create:", err);
    }

    const newListing=new Listing(req.body.listing);
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
    res.status(201).json({ listing: newListing });
});

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
        return res.status(404).json({ error: "Listing not found" });
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
    res.status(200).json({ listing });
});

module.exports.rendereditedListing=(async(req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id);
    if(!listing){
         req.flash("error", "Listing not found!");
         return res.redirect("/listings"); 
     }
    res.json({ listing });
});

module.exports.renderdeleteListing=(async(req,res,next)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.status(200).json({ deleted: true, id });
})

module.exports.geocodeLocation = geocodeLocation;

