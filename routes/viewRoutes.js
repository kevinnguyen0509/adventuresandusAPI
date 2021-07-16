const express = require("express");
const viewController = require("../controller/viewController");

const router = express.Router();

router.get("/", viewController.getLoginScreen);
router.get("/adventures", viewController.getAdventureScreen);
router.get("/signup", viewController.getSignupScreen);

module.exports = router;
