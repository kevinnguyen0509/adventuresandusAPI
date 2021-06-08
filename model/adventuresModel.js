const mongoose = require("mongoose");

const adventuresSchema = new mongoose.Schema({
  title: {
    type: String,
    require: [true, "An adventure must have a name."],
    maxLength: [50, "The title must be 50 charaters or less."],
    minLength: [2, "A title must have more than 1 charater"],
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
