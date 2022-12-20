const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "email field cannot be empty"],
    unique: true,
  },
  phone: {
    type: String,
    required: [true, "email field cannot be empty"],
  },
  password: {
    type: String,
    required: [true, "password field cannot be empty"],
  },
});

UserSchema.pre("save", async function () {
  if (this.isNew) {
    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_GENSALT));
    this.password = await bcrypt.hash(this.password, salt);
  }
});

UserSchema.methods.comparePassword = async function (userPassword) {
  return (isMatch = await bcrypt.compare(userPassword, this.password));
};

module.exports = mongoose.model("AppUser", UserSchema);
