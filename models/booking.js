var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var bookingSchema = new Schema ({
    "userID": String,
    "listingID" : String,
    "daysBooked" : Number,
    "startDate" : Date,
    "endDate" : Date,
    "totalPrice" : Number
});

module.exports = mongoose.model('Booking', bookingSchema);