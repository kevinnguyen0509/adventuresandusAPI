const express = require("express");
const viewController = require("../controller/viewController");

const router = express.Router();

router.get("/", viewController.getAdventureScreen);
router.get("/adventures", viewController.getAdventureScreen);
router.get("/signup", viewController.getSignupScreen);
router.get("/login", viewController.getLoginScreen);
module.exports = router;
