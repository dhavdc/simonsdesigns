  var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose");
    passport = require("passport");
    LocalStrategy = require("passport-local");
    User = require("./models/user");
    Request = require("./models/request");
    Design = require("./models/design");
    paypal = require("paypal-rest-sdk");

mongoose.connect("mongodb://test:test@ds231228.mlab.com:31228/simondesigns", {useMongoClient: true});
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
paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'AdhtaKc9ZETb7mplptbjv-FB9_ypi6u49-tobnB7JtlQPl4f06n43FVhSZAYoaTdq9iq3ggY1B6GCleT',
  'client_secret': 'EBwYyRwG6mgYeIMln8pFSIcxG1ffbPBJF_kPpbRYT_Ur8Emd-xRPR503c4d7nrnteCsnyH-olsFE9-fD'
});

//REALLY SHITTY CODE I KNOW I'LL CLEAN LATER

//Design Schema

// var newUser = new User({username: "simon"});
// User.register(newUser, "scorpion1", (err, user) => {
//   if (err){
//     console.log(err)
//     return "nigga"
//   }
//   passport.authenticate("local")
// })



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




app.get("/designs", (req, res) => {
  Design.find({}, function(err, allDesigns){
    if (err){
      console.log(err);
    } else{
      res.render("designs", {Design: allDesigns});
    }
  });
});



app.get("/requests", (req, res) => {
  res.render("requests");

});

app.get("/success", (req, res) => {
  res.render("success");
  res.redirect("/");
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

function isLoggedIn(req, res, next){
  if (req.isAuthenticated()){
    return next();
  }
  res.redirect("/admin/login");
}

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

app.get("/designs/:id", (req, res) => {
  Design.findById(req.params.id, (err, foundDesign) => {
    if (err){
      res.redirect("/");
    } else{
      res.render("showPage", {design: foundDesign});
    }
  });
});



//AUTH ROUTES

app.get("/admin/login", (req, res) => {
  res.render("login");
})
// app.post('/login', function(req, res, next) {
//     console.log(req.url);
//     passport.authenticate('local', function(err, user, info) {
//         console.log("authenticate");
//         console.log(err);
//         console.log(user);
//         console.log(info);
//     })(req, res, next);
// });

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




app.post('/login', (req, res) => passport.authenticate('local', { successRedirect: '/admin/requests', failureRedirect: '/admin/login', })(req, res));







var port = process.env.PORT || 8080;

//Server Listen
app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});
