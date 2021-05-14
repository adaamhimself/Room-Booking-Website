var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var listingSchema = new Schema ({
    "title": String,
	"description": String,
	"pricepernight": Number,
    "location": String,
    featured: {
        Boolean
    },
    "photoloc": String
});

module.exports = mongoose.model('Listing', listingSchema);