var express = require("express");
var router = express.Router();
Request = require("../models/request"),


router.get("/success", (req, res) => {
  res.render("success");
})


router.get("/requests", (req, res) => {
  res.render("requests");

});

router.post("/requests", (req, res) => {
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

module.exports = router;
