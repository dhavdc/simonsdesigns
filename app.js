  var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose");
    passport = require("passport");
    LocalStrategy = require("passport-local");
    User = require("./models/user");
    Request = require("./models/request");
    Design = require("./models/design");
    fileUpload = require('express-fileupload');


mongoose.connect("mongodb://test:test@ds231228.mlab.com:31228/simondesigns", {useMongoClient: true}); //PRODUCT
//mongoose.connect("mongodb://localhost/simon_designs", {useMongoClient: true}); //LOCAL testing
app.use(fileUpload());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(require("express-session")({
  secret: "skrt",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
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

//Design ROUTES

app.get("/designs", (req, res) => {
  Design.find({}, function(err, allDesigns){
    if (err){
      console.log(err);
    } else{
      res.render("designs", {Design: allDesigns});
    }
  });
});

app.post("/designs/upload", (req, res) => {
  if (!req.files) {
    return res.status(400).send('No files were uploaded.');
  }
  var designFile = req.files.designFile;
  var designName = req.body.name;
  designFile.mv('public/images/' + req.files.designFile.name, function(err) {
    if (err){
      return res.status(500).send(err);
    }
    Design.create(
      {
        name: designName,
        image: "/images/" + req.files.designFile.name
      },
      function(err, design){
        if (err){
          console.log(err);
        }
        else{
          res.redirect("/designs");
        }
      });
  });
})

app.get("/designs/:id", (req, res) => {
  Design.findById(req.params.id, (err, foundDesign) => {
    if (err){
      res.redirect("/");
    } else{
      res.render("showPage", {design: foundDesign});
    }
  });
});

app.post("/delete/:id", (req, res) => {
  Request.remove({ _id: req.params.id }, function(err) {
    if (!err) {
            res.redirect("/admin/requests")
    }
    else {
            res.send("Error lmao tell Daniel");
    }
  });
});

//Request ROUTES

app.get("/success", (req, res) => {
  res.render("success");
})


app.get("/requests", (req, res) => {
  res.render("requests");

});

app.post("/requests", (req, res) => {
  var newRequest = {email: req.body.email, type: req.body.type, additional: req.body.additional};
  Request.create(newRequest, (err, newRequest) => {
    if (err){
      console.log(err);
    }
    else{
      res.redirect("success");
    }
  });
});



///AUTH FUNCTION\\\

function isLoggedIn(req, res, next){
  if (req.isAuthenticated()){
    return next();
  }
  res.redirect("/admin/login");
}


//AUTH ROUTES

app.get("/admin/login", (req, res) => {
  res.render("login");
})

app.get("/admin/requests", isLoggedIn, (req, res) => {
  Request.find({}, function(err, allReq){
    if (err){
      console.log(err);
    } else{
      res.render("adminPanel", {Request: allReq});
    }
  });
});

app.get("/admin/adddesign", isLoggedIn, (req, res) => {
  res.render("addDesign");
});

app.post('/login', (req, res) => passport.authenticate('local', { successRedirect: '/admin/requests', failureRedirect: '/admin/login', })(req, res));


var port = process.env.PORT || 8080;

//Server Listen
app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});
