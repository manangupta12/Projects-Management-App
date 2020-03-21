var express = require("express"),
    bodyParser = require("body-parser"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose"),
    User = require("./models/User");

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
mongoose.connect("mongodb://localhost/auth_demo",{useNewUrlParser: true, useUnifiedTopology: true});

app.get("/",function(req,res){
    res.render("land");
})
app.get("/login",function(req,res){
    res.render("login");
})

app.post("/login",passport.authenticate("local",{
            successRedirect: "/secret",
            failureRedirect: "/register"
    }),function(req,res){

})
app.get("/register",function(req,res){
    res.render("register");
})

app.post("/register",function(req,res){
    var newUser = new User({
        username : req.body.username});
    console.log("reg");
    User.register(newUser,req.body.password,function(err,user){
        if(err){
            console.log(err);
            res.redirect("/register");
        }
        else{
            console.log(user);
            passport.authenticate("local")(req,res,function(){
            res.redirect("/secret");
            });
        }
    })
})
app.get("/secret",isLoggedIn,function(req,res){
    console.log(req.user);  
    res.render("secret",{user:req.user});
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

app.listen(3000,function(){
    console.log("Server has started at 3000!!!");
})
