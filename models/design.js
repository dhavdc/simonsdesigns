var mongoose = require("mongoose");


var designSchema = new mongoose.Schema({
  name: String,
  image: String
});


module.exports = mongoose.model("Design", designSchema);
