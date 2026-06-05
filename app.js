const express=require("express");
const app=express(); //creating server using express
const mongoose=require("mongoose"); //connects mongodb with node.js
const Listing = require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema} = require("./views/listings/schema.js");



const MONGO_URL='mongodb://127.0.0.1:27017/wonderlust';//search mongoosejs and copy connect link 
main().then((res)=>{
    console.log("connected to database");
}).catch((err)=>{
    console.log(err);
});

async function main(){
   await mongoose.connect(MONGO_URL); 
}
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true})); //to parse the form data from the request body
app.use(methodOverride("_method")); //to use method override in our app and we are using _method as the query string to override the method, it chceks if there is method in form tag , if there is no method in the form then it will use the method in the query string
app.engine("ejs",ejsMate); //to use ejs mate as the template engine for our app and it allows us to use layouts and partials in our ejs files
app.use(express.static(path.join(__dirname,"public"))); //to serve static files from the public directory and we are using path.join to join the current directory with the public directory and it will give us the absolute path of the public directory and we are using express.static to serve the static files from the public directory

app.get("/",(req,res)=>{
    res.send("Hi iam Root");
});

const validateListing=(req,res,next)=>{
let {error} = listingSchema.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=>{
           el.message.jppin(",");
        });
        throw new ExpressError(400,errmsg);
    }else{
        next();
    }
}

//index route - create a route to show all listings
app.get("/listings", wrapAsync(async (req,res)=>{
    try {
        const allListings = await Listing.find({});
        res.render("listings/index",{allListings});
    } catch (err) {
        console.log(err);
        res.status(500).send("Error fetching listings");
    }
}));


//new route - create a route to show a form to create a new listing
app.get("/listings/new", (req,res)=>{
    res.render("listings/new.ejs");
});


//show route - create a route to show a single listing
app.get("/listings/:id", wrapAsync(async (req,res)=>{//wrapAsync is a function that takes a function as an argument and returns a new function that catches any error thrown by the original function and passes it to the next middleware which is the error handling middleware
     let {id} = req.params;
     const listing= await Listing.findById(id);
     res.render("listings/show.ejs",{listing});
}));

//create route - create a route to create a new listing and save it to the database
app.post("/listings",validateListing,wrapAsync(async(req,res,next)=>{
    
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
app.put("/listings/:id",validateListing,wrapAsync(async(req,res,next)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id, req.body.listing);
    res.redirect(`/listings/${id}`);
}));


//edit route - create a route to fetch the added daya from db and show a form to edit a listing
app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
let {id}=req.params;
const listing= await Listing.findById(id);
res.render("listings/edit.ejs",{listing}); //we are passing the listings to edit.ejs and it takes template , makes htm
}));

//delete route - create a route to delete a listing from the database and redirects to the index page
app.delete("/listings/:id",wrapAsync(async(req,res,next)=>{
let {id}=req.params;
let deletedListing=await Listing.findByIdAndDelete(id);
console.log(deletedListing);
res.redirect("/listings");
}));

// app.get("/testListing", async(req,res)=>{
//     let sampleListing=new Listing({
//         title:"My new villa",
//         description:"my the beach",
//         price:1200,
//         location:"Calangute,goa",
//         country:"india",
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing");
// });
app.use((req,res,next)=>{//this middleware will match all the routes that are not defined above and it will throw an error with status code 404 and message "Page Not Found" and it will pass the error to the next middleware which is the error handling middleware
    next (new ExpressError(404, "Page Not Found"))
});

app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went Wrong"}=err;
    res.status(statusCode).render("error.ejs", {err,message,statusCode });
});

app.listen(8080,()=>{
    console.log("server is listening to port 8080");
});
