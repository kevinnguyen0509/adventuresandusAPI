const { promisify } = require("util");
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

exports.protect = async (req, res, next) => {
  try {
    //1) Get token and check if it's their
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(new AppError("You are not logged in!"), 401);
    }

    //2) Validate token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    console.log(decoded);

    //3) Check if user still exists
    const freshUser = await User.findById(decoded.id);
    if (!freshUser) {
      return next(new AppError("User with this token no long exsits", 401));
    }
    //4) Check if user changed passwored after the JWT was issued
    if (freshUser.changedpasswordAfter(decoded.iat)) {
      return next(
        new AppError("User recently changed password. Login again.", 401)
      );
    }
    //Grant Access to GetAllAdventures route
    req.user = freshUser;
    next();
  } catch (err) {
    res.status(404).json({
      status: "failed",
      message: err,
    });
  }
};
