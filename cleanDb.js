var mongoose = require("mongoose");
var User = require("./models/User")
var Projects = require("./models/P_Project");
function cleanDb(){
    User.deleteMany({},function(err){
        if(err) console.log(err);
    });

    Projects.deleteMany({},function(err){
        if(err) console.log(err);
    });
    
    // User.find({},function(err,users){
    //     if(err) console.log(err);
    //     else console.log(users);
    // })
}
module.exports = cleanDb;