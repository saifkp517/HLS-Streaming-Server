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

const imageSchema = new mongoose.Schema({
  image: {type: String},
  imgName: {type: String},
  user: {type: String}
})

module.exports = mongoose.model("Image", imageSchema)
module.exports = mongoose.model("User", userSchema);
