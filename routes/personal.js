var express = require("express");
var router = express.Router(); //a new instance of express router and adding routes to this router. 
var Projects = require("../models/P_Project");
// var middleware = require("../middleware");

router.get("/personal",function(req,res){
    Projects.find({id:req.User.id},function(err,projects){
        if(err) console.log(err);
        else{
            res.render("personal",{projects:projects});
        }
    })
});