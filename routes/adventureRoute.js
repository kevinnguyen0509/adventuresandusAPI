const express = require("express");
const Adventure = require("../model/adventuresModel");
const adventureController = require("./../controller/adventureController");
const router = express.Router();

router
  .route("/")
  .get(adventureController.getAllAdventures)
  .post(adventureController.createAdventure)
  .delete(adventureController.deleteAdventure);

router.route("/:tag").get(adventureController.getAdventureCategory);

module.exports = router;
