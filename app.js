  var express = require("express"),
      app = express(),
      bodyParser = require("body-parser"),
      mongoose = require("mongoose"),
      passport = require("passport"),
      LocalStrategy = require("passport-local"),
      User = require("./models/user"),
      Request = require("./models/request"),
      Design = require("./models/design"),
      fileUpload = require('express-fileupload'),
      favicon = require('serve-favicon');
      path = require('path')



var designRoutes = require("./routes/designs"),
    requestRoutes = require("./routes/requests"),
    adminRoutes = require("./routes/admin");


//mongoose.connect("mongodb://test:test@ds231228.mlab.com:31228/simondesigns", {useMongoClient: true}); //PRODUCT
mongoose.connect("mongodb://localhost/simon_designs", {useMongoClient: true}); //LOCAL testing
app.use(fileUpload());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(require("express-session")({
  secret: "skrt",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(designRoutes);
app.use(requestRoutes);
app.use(adminRoutes);
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.set("view engine", "ejs");


//Add new user to admin

// var newUser = new User({username: "simon"});
// User.register(newUser, "scorpion1", (err, user) => {
//   if (err){
//     console.log(err)
//   }
//   passport.authenticate("local")
// })


//Template for creating designs
// design.create(
//   {
//     name: "RandomDesign6",
//     image: "/images/danielflips.png"
//   },
//   function(err, design){
//     if (err){
//       console.log(err);
//     }
//     else{
//       console.log(design);
//     }
//   });
//Get Routes
app.get("/", (req, res) => {
  res.render("index");
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

var port = process.env.PORT || 8080;

//Server Listen
app.listen(port, function() {
    console.log('App is running on http://localhost:' + port);
});
