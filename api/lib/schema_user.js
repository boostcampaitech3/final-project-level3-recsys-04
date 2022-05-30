const mongoose = require("mongoose");
mongoose.pluralize(null);

const UserSchema = new mongoose.Schema({
  "uid": Number,
  "login": String,
  "star_pages": Number,
  "star_in_item": Array
})

module.exports = mongoose.model('user_infos', UserSchema)