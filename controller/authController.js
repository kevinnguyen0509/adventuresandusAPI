const jwt = require("jsonwebtoken");
const User = require("./../model/userModel");
const AppError = require("./../utils/AppError");

const assignToken = (newUserid) => {
  return jwt.sign({ id: newUserid }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);

    const token = assignToken(newUser._id);

    res.status(201).json({
      status: "success",
      token,
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

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  //1) check if email and password exists
  try {
    if (!email || !password) {
      return next(new AppError("Please provide email and password", 400));
    }

    //2) check if user exists && password is correct
    const user = await User.findOne({ email: email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError("Incorrect email or password", 401));
    }

    //3) if everything is ok, send tocken

    const token = assignToken(user._id);
    console.log(token);
    res.status(200).json({
      status: "success",
      token,
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      message: err,
    });
  }
};
