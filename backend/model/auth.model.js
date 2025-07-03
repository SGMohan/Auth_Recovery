const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a username"],
    unique: true,
    trim: true,
    maxlength: [20, "Name cannot be more than 20 characters"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please provide a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: [12, "Password must be at least 6 characters"],
    select: false,
    },
    resetToken: {
        type: String,
        default: null,
    },
    resetTokenExpiry: {
        type: Date,
        default: null,
    },
},{timestamps: true});

const UserModel = mongoose.model("users", userSchema);
module.exports = UserModel;
