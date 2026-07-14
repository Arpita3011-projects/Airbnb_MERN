if(process.env.NODE_ENV !="production"){
require('dotenv').config();
}

const express = require("express");
const app = express(); //creating server using express
const mongoose = require("mongoose"); //connects mongodb with node.js
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");


const ExpressError = require("./utils/ExpressError.js");

const Review = require("./models/review.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const session = require("express-session");
const flash = require("connect-flash");


const {MongoStore}=require('connect-mongo');

// Mongo-backed session store (Atlas)
const store = MongoStore.create({
    mongoUrl: process.env.ATLASDB_URL,
    touchAfter:24 *60*60,
    secret: process.env.SESSION_SECRET,

});





const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");

const dburl = process.env.ATLASDB_URL;


async function main() {
    if (!dburl) throw new Error('Missing ATLASDB_URL environment variable');

    try {
        await mongoose.connect(dburl, {
            serverSelectionTimeoutMS: 5000,
        });


    } catch (err) {
        console.error("Mongo connection failed:", err);
        throw err;
    }
}




// Production-friendly settings (Render/Proxy)
app.set('trust proxy', 1);

// CORS for React frontend (credentials needed for sessions)
const cors = require('cors');
app.use(cors({
    origin: process.env.FRONTEND_ORIGIN,
    credentials: true,
}));



app.use(express.urlencoded({ extended: true })); //to parse the form data from the request body
app.use(methodOverride("_method")); //to use method override in our app and we are using _method as the query string to override the method, it chceks if there is method in form tag , if there is no method in the form then it will use the method in the query string

app.use(express.static(path.join(__dirname, "public"))); //to serve static files from the public directory and we are using path.join to join the current directory with the public directory and it will give us the absolute path of the public directory and we are using express.static to serve the static files from the public directory



const sessionOptions = {
    
    store,
    secret: process.env.SESSION_SECRET,

    resave: false,
    saveUninitialized: true,

    cookie: {
        expires: Date.now() +7* 24* 60 * 60* 1000,//7 days 24hrs 60 min 60 sec 1000ms + todays date= date which is after 1 week
        maxAge: 7 *24 * 60 *60 *1000,
        httpOnly: true,
        ...(process.env.NODE_ENV==='production'
            ? { secure:true,sameSite: 'none' }
            : {}),
    },
};
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session()); //lets website know that same user is navigating to different pages
passport.use(new localStrategy(User.authenticate())); //all users should be autheticated through local strategy, uses .aurthenticate() method

passport.serializeUser(User.serializeUser()); //store userinfo into the session
passport.deserializeUser(User.deserializeUser()); //unstore userinfo after session ends



app.use((req, res, next) => {
    // Keep flash/session values for auth flows that rely on redirects.
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    res.locals.currentPath = req.path;
    next();
});




app.get("/", (req, res) => {
    res.redirect("/listings");
});
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);
console.log("Mounting /me routes...");
app.use((req, res, next) => {
    console.log("Incoming:", req.method, req.url);
    next();
});

app.get("/me", (req, res) => {
    console.log("DIRECT /me HIT");
    res.json({
        ok: true,
        user: req.user || null,
    });
});






app.use((req,res,next) => {//this middleware will match all the routes that are not defined above and it will throw an error with status code 404 and message "Page Not Found" and it will pass the error to the next middleware which is the error handling middleware
    next(new ExpressError(404, "Page Not Found"))
});


app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went Wrong" } = err;

    res.status(statusCode).json({
        err,
        message,
        statusCode,
    });
});


main()
    .then(() => {
        const PORT = process.env.PORT || 8080;

        app.listen(PORT, () => {
            console.log(`Server is listening on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Fatal: failed to connect to MongoDB:", err);
        process.exit(1);
    });

