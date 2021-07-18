const Adventure = require("../model/adventuresModel");

exports.getAdventureScreen = async (req, res, next) => {
  try {
    // 1) Get all tours
    const adventures = await Adventure.find();

    res.status(200).render("adventures", {
      title: "Adventures",
      adventures: adventures,
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: error,
    });
  }
};

exports.getLandingScreen = (req, res) => {
  res.status(200).render("base", {
    adventure: "Test Adventure",
    user: "Kevin",
    title: "Whats new?",
  });
};

exports.getLoginScreen = (req, res) => {
  res.status(200).render("login", {
    adventure: "Test Adventure",
    user: "Kevin",
    title: "Login",
  });
};

exports.getSignupScreen = (req, res) => {
  res.status(200).render("signup", {
    title: "Sign up",
  });
};
