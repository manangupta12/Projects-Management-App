var mongoose = require("mongoose");
var P_Schema = mongoose.Schema({   
    user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
    },
    title:String,
    task : String
});

module.exports = mongoose.model("P_project",P_Schema);
// P_project.create({
//     title:"Face Recognition!",
//     tasks:["Basic Interface"]
// },function(err,project){
//     if(err) console.log(err);
//     else console.log(project)
// });

// P_project.find({title:"Face Recognition!"},function(err,project){
//     if(err) console.log(err);
//     else {
//         project.tasks.push("Heyyy");
//     }}
// );