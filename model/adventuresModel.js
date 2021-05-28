const mongoose = require("mongoose");

const adventuresSchema = new mongoose.Schema({
  title: {
    type: String,
    require: [true, "An adventure must have a name."],
    unique: true,
  },
  description: {
    type: String,
    default: "Click on the image to find out more!",
  },
  image: {
    type: String,
    require: [true, "And adventure must have an image."],
  },
  url: {
    type: String,
    require: [true, "An adventure must have a url for more details"],
  },
  tag: {
    type: String,
    require: [true, "An adventure must have atleast one tag."],
  },
  location: {
    type: String,
    default: "unknown",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Adventure = mongoose.model("Adventures", adventuresSchema);
module.exports = Adventure;
