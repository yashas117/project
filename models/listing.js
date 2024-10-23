const mongoose = require("mongoose");
const review = require("./review");

const Schema = mongoose.Schema;

const listingSchema = new Schema({

    title: {
        type: String,
        required: true,
    },
    description: String,
    image: String,
        //     default: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.shutterstock.com%2Fdiscover%2Ffree-nature-images&psig=AOvVaw1rIwl0guPv-LpUmW5qzIGs&ust=1723531814638000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCOjr773u7ocDFQAAAAAdAAAAABAE",
        // set: (v) => v === " " ?
        //  "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.shutterstock.com%2Fdiscover%2Ffree-nature-images&psig=AOvVaw1rIwl0guPv-LpUmW5qzIGs&ust=1723531814638000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCOjr773u7ocDFQAAAAAdAAAAABAE" :
        //   v,
        // }
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }
});

listingSchema.post("findOneAndDelete", async(listing) => {
    if(listing) {
        await review.deleteMany({_id: {$in: listing.reviews}});
    }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;