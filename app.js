var express = require("express"),
    bodyParser = require("body-parser"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose"),
    User = require("./models/User"),
    cleanDb = require("./cleanDb"),
    Projects = require("./models/P_Project");
//cleanDb();

const MongoClient = require('mongodb').MongoClient;

// replace the uri string with your connection string.
const uri = "mongodb+srv://manan:Manangupta852@@cluster0-hjcqz.mongodb.net/test?retryWrites=true&w=majority"
MongoClient.connect(uri, function(err, client) {
   if(err) {
        console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
   }
   console.log('Connected to MongoDB...');
   const collection = client.db("test").collection("devices");
   // perform actions on the collection object
   client.close();
});

mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});

//mongoose.connect("mongodb://localhost/test_app",{useNewUrlParser: true, useUnifiedTopology: true});
//mongoose.set('useNewUrlParser', true);
//mongoose.set('useFindAndModify', false);
//mongoose.set('useCreateIndex', true);
//mongoose.set('useUnifiedTopology', true);

var app = express();

app.use(require("express-session")({
    secret: "I love my life !!",
    resave : false,
    saveUninitialized : false
}));
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(User.authenticate()));


app.get("/",function(req,res){
    res.render("land");
})
app.get("/login",function(req,res){
    res.render("login");
})

app.post("/login",passport.authenticate("local",{
            successRedirect: "/personal",
            failureRedirect: "/register"
    }),function(req,res){
        
})

app.get("/register",function(req,res){
    res.render("register");
})

app.post("/register",function(req,res){
    var newUser = new User({
        username : req.body.username,
        id       : req.body.id,
        projects : ""
    });
    User.register(newUser,req.body.password,function(err,user){
        if(err){
            console.log(err);
            res.redirect("/register");
        }
        else{
            //console.log(user);
            passport.authenticate("local")(req,res,function(){
            res.redirect("/personal");
            });
        }
    })
})


app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/");
});
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}




//====================PERSONAL PROJECTS================================

var Projects = require("./models/P_Project");
// var middleware = require("../middleware");

app.get("/personal",function(req,res){
    Projects.find({user:req.user},function(err,projects){
        if(err) console.log(err);
        else{
            console.log(projects);
            res.render("personal",{user:req.user,projects:projects});
        }
    })
});

app.post("/personal",function(req,res){
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

app.get("/personal/add",function(req,res){
    res.render("addPersonal");
})

//====================GROUP PROJECTS================================

var Group_Projects = require("./models/group_project");
var Task = require("./models/task")
// var middleware = require("../middleware");

app.get("/GroupProjects",function(req,res){
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


app.get("/group",function(req,res){
    Group_Projects.find({}).populate('tasks').exec(function(err,projects){
        if(err) console.log(err);
        else{
            console.log(projects);
            res.render("groups",{tasks:projects});
        }
    });
});

app.post("/group",function(req,res){
    Group_Projects.create({
        title : req.body.title
    },function(err,group){
        if(err) console.log(err);
        else{
            res.redirect("/GroupProjects");
        }
    });

});

app.get("/group/add",function(req,res){
    res.render("addGroup");
});

app.get("/group/:id/addTask",function(req,res){
    console.log(req.params.id);
    res.render("addTask",{projectId:req.params.id});
});

app.post("/group/:id/tasks",function(req,res){
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

app.listen(3000,function(){
    console.log("Server has started at 3000!!!");
})
