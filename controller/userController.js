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
    console.log(req.query);

    const allUsers = await User.find();
    res.status(200).json({
      result: allUsers.length,
      status: "Success",
      allUsers: allUsers,
    });
  } catch (err) {
    res.status(400).json({
      status: "Failed",
      message: err,
    });
  }
};
