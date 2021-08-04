const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    sub: { type: String },
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String }
  });

module.exports = mongoose.model('User', UserSchema);
