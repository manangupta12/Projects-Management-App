var express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    User = require("../models/User");

router.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
});


router.get("/",function(req,res){
    res.render("land");
})
router.get("/login",function(req,res){
    res.render("login");
})

router.post("/login",passport.authenticate("local",{
            successRedirect: "/personal",
            failureRedirect: "/register"
    }),function(req,res){
        
})

router.get("/register",function(req,res){
    res.render("register");
})

router.post("/register",function(req,res){
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

router.get("/logout",function(req,res){
    req.logout();
    res.redirect("/");
});
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


module.exports = router;