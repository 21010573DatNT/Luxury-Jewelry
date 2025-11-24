const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  password: String,
  address: String,
  phone: String,
  token: String,
  refreshToken: String,
  avatar: String,
  status: String,
  totalOrder: Number,
  agreeMarketing: {
    type: Boolean,
    default: false
  },
  deleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date
}, {
  timestamps: true
});

const User = mongoose.model("User", userSchema, "users");

module.exports = User;