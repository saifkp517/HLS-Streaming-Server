import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  _id: {type: String},
  displayName: {type: String},
  email: {type: String},
  coordinates: {
    latitude: {type: Number},
    longitude: {type: Number}
  }
});

module.exports = mongoose.model("User", userSchema);
