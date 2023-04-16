const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
  },
  name: {
    type: String,
  },
  password: {
    type: String,
  },
  dob: {
    type: String,
  },
});

const User = mongoose.model("Users", UserSchema);

module.exports = User;