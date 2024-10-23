const express = require("express");
const router = express.Router();

const {listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { isLoggedIn, isOwner } = require("../middleware.js");

const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

const listingController = require("../controllers/listing.js");
const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    // console.log(error);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};

router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingController.createListing)
    );

//Index Route
// router.get("/", wrapAsync(listingController.index));

//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

//Create Route
// router.post("/",isLoggedIn, validateListing, wrapAsync(listingController.createListing));

router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn,
        isOwner,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingController.updateListing))
    .delete(isLoggedIn,
        isOwner,
        wrapAsync(listingController.deleteListing)
);
//Show Route
// router.get("/:id",wrapAsync(listingController.showListing));

//Update Route
// router.put("/:id", isLoggedIn,
//     validateListing,
//     wrapAsync(listingController.updateListing));

    // delete Route
// router.delete("/:id", 
//     wrapAsync(listingController.deleteListing));

    //Edit Route
router.get("/:id/edit", isLoggedIn,
    wrapAsync(listingController.editListing));

module.exports = router;