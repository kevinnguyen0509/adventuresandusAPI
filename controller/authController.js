const User = require("./../model/userModel");

exports.signup = async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json({
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "Success",
      message: err,
    });
  }
};
