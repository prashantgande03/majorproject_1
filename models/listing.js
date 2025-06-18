const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title:{
       type:String,
       required:true,
    },
    description:String,
    image:{
            filename: {
                type: String,
                default: "defaultimage",
            },
            url: {
                type: String,
                default: "https://content.jdmagicbox.com/comp/raigad-maharashtra/p8/9999p2145.2145.180420114659.b3p8/catalogue/raigad-fort-mahad-raigad-maharashtra-tourist-attraction-0dhxyztqnl.jpg?fit=around%7C350:350&crop=350:350;*,*",
                set: (v) => v === "" ? "https://content.jdmagicbox.com/comp/raigad-maharashtra/p8/9999p2145.2145.180420114659.b3p8/catalogue/raigad-fort-mahad-raigad-maharashtra-tourist-attraction-0dhxyztqnl.jpg?fit=around%7C350:350&crop=350:350;*,*" : v,
            }
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type: Schema.Types.ObjectId,
            ref:"review",
        },
    ],
});

const listing = mongoose.model('listing',listingSchema);
module.exports = listing;
