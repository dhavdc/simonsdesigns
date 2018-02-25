var express = require("express");
var router = express.Router();
Request = require("../models/request");
passport = require("passport");


function isLoggedIn(req, res, next){
  if (req.isAuthenticated()){
    return next();
  }
  res.redirect("/admin/login");
}


router.get("/admin/login", (req, res) => {
  res.render("login");
})

router.get("/admin/requests", isLoggedIn, (req, res) => {
  Request.find({}, function(err, allReq){
    if (err){
      console.log(err);
    } else{
      res.render("adminPanel", {Request: allReq, Login: true});
    }
  });
});

router.get("/admin/adddesign", isLoggedIn, (req, res) => {
  res.render("addDesign", {Login: true});
});

router.post('/login', (req, res) => passport.authenticate('local',
  { successRedirect: '/admin/requests',
    failureRedirect: '/admin/login', })
    (req, res));

module.exports = router;
