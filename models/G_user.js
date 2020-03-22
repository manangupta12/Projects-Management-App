var mongoose = require("mongoose");

var G_Schema = mongoose.Schema({
    user:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    task:[{
        
    }]
    task : [String]
});