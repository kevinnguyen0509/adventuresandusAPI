const express = require("express");
const userController = require("./../controller/userController");
const authController = require("./../controller/authController");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

router.patch(
  "/updateMyPassword",
  authController.protect,
  authController.updatePassword
);

router.patch("/updateMe", authController.protect, userController.updateMe);

router.route("/").get(authController.protect, userController.getAllUsers);

module.exports = router;
