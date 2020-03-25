var express = require("express"),
    router = express.Router();
var Projects = require("../models/P_Project");
// var middleware = require("../middleware");

router.get("/",isLoggedIn,function(req,res){
    Projects.find({user:req.user},function(err,projects){
        if(err) console.log(err);
        else{
            console.log(projects);
            res.render("personal",{currentUser:req.user,projects:projects});
        }
    })
});

router.post("/",isLoggedIn,function(req,res){
    Projects.create({
        user:req.user,
        title: req.body.title,
        task: req.body.task
    },function(err,project){
        if(err) console.log(err);
        else{
            console.log(project);
            res.redirect("/personal");
        }
    });
})

router.get("/add",isLoggedIn,function(req,res){
    res.render("addPersonal");
})
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;