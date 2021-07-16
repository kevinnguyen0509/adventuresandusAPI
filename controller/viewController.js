exports.getLoginScreen = (req, res) => {
  res.status(200).render("base", {
    adventure: "Test Adventure",
    user: "Kevin",
  });
};

exports.getAdventureScreen = (req, res) => {
  res.status(200).render("adventures", {
    title: "Adventures",
  });
};

exports.getSignupScreen = (req, res) => {
  res.status(200).render("signup", {
    title: "Sign up",
  });
};
