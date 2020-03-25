var express = require("express"),
    bodyParser = require("body-parser"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose"),
    User = require("./models/User"),
    cleanDb = require("./cleanDb"),
    Projects = require("./models/P_Project");


var personalRoutes = require("./routes/personal"),
    groupRoutes = require("./routes/group"),
    indexRoutes = require("./routes/index");
//cleanDb();

const MongoClient = require('mongodb').MongoClient;

//replace the uri string with your connection string.
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

mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true });

// mongoose.connect("mongodb://localhost/test_app",{useNewUrlParser: true, useUnifiedTopology: true});
// mongoose.set('useNewUrlParser', true);
// mongoose.set('useFindAndModify', false);
// mongoose.set('useCreateIndex', true);
// mongoose.set('useUnifiedTopology', true);

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



app.use("/personal",personalRoutes);
app.use("/group",groupRoutes);
app.use(indexRoutes);
app.listen(3000,function(){
    console.log("Server has started at 3000!!!");
})
