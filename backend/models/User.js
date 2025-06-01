const mongoose = require("mongoose");

const PasswordSchema = new mongoose.Schema({
  site: String,
  username: String,
  encryptedPassword: String,
  iv: String,
});

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  masterKey: String, // hashed
  passwords: [PasswordSchema],
});

module.exports = mongoose.model("User", UserSchema);
