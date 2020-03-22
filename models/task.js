var mongoose = require("mongoose");
var task_schema = mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    task : String
});

module.exports = mongoose.model("Task",task_schema);