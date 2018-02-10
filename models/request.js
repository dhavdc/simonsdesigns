var mongoose = require("mongoose");


var requestSchema = new mongoose.Schema({
  email: String,
  type: String,
  additional: String
});

module.exports = mongoose.model("Request", requestSchema);
