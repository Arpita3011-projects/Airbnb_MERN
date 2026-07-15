if(process.env.NODE_ENV !="production"){
require('dotenv').config();
}

const express = require("express");
const app = express(); 
const mongoose = require("mongoose"); 
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





app.set('trust proxy', 1);


const cors = require('cors');
app.use(cors({
    origin: process.env.FRONTEND_ORIGIN,
    credentials: true,
}));



app.use(express.urlencoded({ extended: true })); 
app.use(methodOverride("_method")); 

app.use(express.static(path.join(__dirname, "public")));  



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
app.use(passport.session()); 
passport.use(new localStrategy(User.authenticate())); 
passport.serializeUser(User.serializeUser()); 
passport.deserializeUser(User.deserializeUser()); 



app.use((req, res, next) => {
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

app.use((req, res, next) => {
    next();
});

app.get("/me", (req, res) => {
    res.json({
        ok: true,
        user: req.user || null,
    });
});







app.use((req,res,next) => {
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

