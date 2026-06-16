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
const Review=require("./models/review.js");
const {reviewSchema} = require("./views/listings/schema.js");
const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js");




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



const validateReview=(req,res,next)=>{
    const {error} =reviewSchema.validate(req.body);
    if (error){
        const errmsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errmsg);
    }else{
        next();
    }
}


    app.use("/listings",listings);
    app.use("/listings/:id/reviews",reviews);




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
