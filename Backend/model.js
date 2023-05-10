const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name : String,
  password: String,
  email:String,
  birth:String,
  fathername:String,
});

const User = mongoose.model('User', userSchema);
module.exports = User;