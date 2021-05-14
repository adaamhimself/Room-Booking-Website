var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

var userSchema = new Schema ({
	"fullname": String,
	"email": {
    type: String,
    Unique: true
    },
	"password": String,
    "birthdate": Date,
    "admin": {
    type: String,
    default: "false"
    }
});

module.exports = mongoose.model('User', userSchema);