var mongoose              = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");

var User_schema = mongoose.Schema({
    id       : String,
    username : String,
    password : String,
});

User_schema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User",User_schema);