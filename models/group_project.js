var mongoose = require("mongoose");

var group_schema = mongoose.Schema({
    title : String,
    tasks : [{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Task"
    }]
});

module.exports = mongoose.model("Group_Task",group_schema);