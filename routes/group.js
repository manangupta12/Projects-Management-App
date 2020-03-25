var express = require("express"),
    router = express.Router();
var Group_Projects = require("../models/group_project");
var Task = require("../models/task");
// var middleware = require("../middleware");

router.get("/GroupProjects",isLoggedIn,function(req,res){
    Task.find({user:req.user},function(err,t){
        Group_Projects.find({tasks:t}).populate('tasks').exec(function(err,p){
            if(err) console.log(err);
            else{
                console.log(p);
                res.render("GroupProjects",{username:req.user.username,projects:p});
            }
        })
        });
    });


router.get("/group",isLoggedIn,function(req,res){
    Group_Projects.find({}).populate('tasks').exec(function(err,projects){
        if(err) console.log(err);
        else{
            console.log(projects);
            res.render("groups",{tasks:projects});
        }
    });
});

router.post("/group",isLoggedIn,function(req,res){
    Group_Projects.create({
        title : req.body.title
    },function(err,group){
        if(err) console.log(err);
        else{
            res.redirect("/GroupProjects");
        }
    });

});

router.get("/add",isLoggedIn,function(req,res){
    res.render("addGroup");
});

router.get("/:id/addTask",isLoggedIn,function(req,res){
    console.log(req.params.id);
    res.render("addTask",{projectId:req.params.id});
});

router.post("/:id/tasks",isLoggedIn,function(req,res){
    User.findOne({id:req.body.Id},function(err,user_f){
        if(err) console.log(err);
        else
        {
            Task.create({
                user: user_f,
                task: req.body.task
            },function(err,t){
                if(err) console.log(err);
                else
                {
                    console.log(t);
                    Group_Projects.findById(req.params.id,function(err,project){
                        if(err) console.log(err);
                        else{
                            project.tasks.push(t);
                            project.save();
                            console.log(project);
                        }
                    });
                    res.redirect("/GroupProjects");
                }
            });
        }
        });
})
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;