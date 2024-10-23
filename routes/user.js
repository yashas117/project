const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {savedRedirectUrl} = require("../middleware.js");

const userController = require("../controllers/user.js");

router.route("/signup")
    .get(userController.renderSignup)
    .post(wrapAsync(userController.signup)
);

router.route("/login")
    .get(userController.renderLogin)
    .post(savedRedirectUrl,
        passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true}),
        userController.login
    );

router.get("/logout", userController.logout);



// router.get("/signup", userController.renderSignup);

// router.post("/signup", wrapAsync(userController.signup));

// router.get("/login", userController.renderLogin);

// router.post("/login", savedRedirectUrl,
//     passport.authenticate("local", {
//     failureRedirect: "/login",
//     failureFlash: true}),
//     userController.login);


module.exports = router;