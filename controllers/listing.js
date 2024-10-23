const Listing = require("../models/listing.js");


module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
};

module.exports.renderNewForm = (req, res) =>{
    res.render("listings/new.ejs"); 
};

module.exports.showListing = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({path: "reviews", 
        populate: {
            path: "author",
        },
    })
    .populate("owner");
    if(!listing) {
        req.flash("error", "Listing you requested does not exist");
        res.redirect("/listings");
    }
    
    res.render("listings/show.ejs", {listing});
};

module.exports.createListing = async (req, res, next) => {   
    
    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = url;
    // if(!newListing.owner.username){
    //     newListing.owner.username = "gamer";
    // }
    await newListing.save();
    req.flash("success", "Successfully added new listing");
    res.redirect("/listings");
};

module.exports.editListing = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Listing you are trying to edit does not exist");
        res.redirect("/listing");
    }
    res.render("listings/edit.ejs", {listing});
};

module.exports.updateListing = async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id ,
    {...req.body.listing});

    if(typeof req.file != "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = url;
        await listing.save();
    }
    
    req.flash("success", "Listing Updated");
    res.redirect("/listings");
};

module.exports.deleteListing = async (req, res) => {
    let {id} = req.params;
    let deletedlisting = await Listing.findByIdAndDelete(id);
    console.log(deletedlisting);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
};



