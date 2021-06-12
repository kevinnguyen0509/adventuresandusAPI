const User = require("./../model/userModel");

exports.createUser = async (req, res) => {
  try {
    res.status(200).json({
      status: "Success",
      message: "Creating user..but for testing it does nothing.",
    });
  } catch (err) {
    res.status(404).json({
      status: "Failed",
      message: err,
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    res.status(200).json({
      status: "Success",
      message: "Getting all users not implemented",
    });
  } catch (err) {
    res.status(404).json({
      status: "Failed",
      message: err,
    });
  }
};
