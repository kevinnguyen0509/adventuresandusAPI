const express = require("express");
//const Adventure = require("../model/adventuresModel");
const adventureController = require("./../controller/adventureController");

const router = express.Router();

router
  .route("/")
  .get(adventureController.getAllAdventures)
  .post(adventureController.createAdventure);

router.route("/search").get(adventureController.searchAdventure);
router.route("/:tag").get(adventureController.getAdventureCategory);

module.exports = router;
