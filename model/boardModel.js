const mongoose = require("mongoose");

const boardSchema = new mongoose.Schema({
  title: {
    type: String,
    require: [true, "Board must have a title"],
    maxLength: [30, "you can only have a max of 20 characters"],
  },
  url: {
    type: String,
  },
  peopleInBoard: {
    type: [],
  },
  OwnerOfBoardID: {
    type: String,
  },
  image: { type: String },
});

const Board = mongoose.model("Boards", boardSchema);
module.exports = Board;
