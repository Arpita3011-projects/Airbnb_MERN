const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController=require("../controllers/users.js");

router.route("/signup")
.get(userController.renderSignup)
.post(wrapAsync(userController.signup));


router.post("/login", (req, res, next) => {
    console.log("LOGIN ROUTE HIT");
    next();
}, passport.authenticate("local"));

router.route("/login")
.get(userController.renderLogin)
.post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash: true }),userController.login,
);


router.post("/logout",wrapAsync(userController.logout));

module.exports = router;


