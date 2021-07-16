const express = require("express");
const boardController = require("./../controller/boardController");
const router = express.Router();

router.route("/").post(boardController.createBoard);

module.exports = router;
