var express = require("express");
var router = express.Router();
Design = require("../models/design");
fileUpload = require('express-fileupload');
passport = require("passport");


function isLoggedIn(req, res, next){
  if (req.isAuthenticated()){
    return next();
  }
  res.redirect("/admin/login");
}


router.get("/designs", (req, res) => {
  Design.find({}, function(err, allDesigns){
    if (err){
      console.log(err);
    } else{
      if (req.user){
        res.render("designs", {Design: allDesigns, Login: true});
      }
      else{
        res.render("designs", {Design: allDesigns, Login: false});
      }
    }
  });
});

router.post("/designs/upload", isLoggedIn, (req, res) => {
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

router.post("/designs/delete/:id", (req, res) => {
  Design.remove({ _id: req.params.id }, function(err) {
    if (!err) {
            res.redirect("/designs")
    }
    else {
            res.send("Error tell Daniel");
    }
  });
});

router.get("/designs/:id", (req, res) => {
  Design.findById(req.params.id, (err, foundDesign) => {
    if (err){
      res.redirect("/");
    } else{
      res.render("showPage", {design: foundDesign});
    }
  });
});



router.post("/delete/:id", (req, res) => {
  Request.remove({ _id: req.params.id }, function(err) {
    if (!err) {
            res.redirect("/admin/requests")
    }
    else {
            res.send("Error deleting ;(");
    }
  });
});

module.exports = router;
