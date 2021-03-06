const crypto = require("crypto");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("./../model/userModel");
const AppError = require("./../utils/AppError");
const sendEmail = require("./../utils/email");

const assignToken = (newUserid) => {
  return jwt.sign({ id: newUserid }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = assignToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user: user,
    },
  });
};

exports.signup = async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);
    createSendToken(newUser, 201, res);
    const token = assignToken(newUser._id);
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
    createSendToken(user, 200, res);
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

exports.forgotPassword = async (req, res, next) => {
  try {
    //1) get user based on Posted email

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(
        new AppError("There is no user with that email address", 404)
      );
    }

    //2) Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // 3) Send it to user's email
    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/users/resetPassword/${resetToken}`;

    const message = `Forgot your password? Submit a Patch request with your new password and passwordConfirm to: ${resetURL} \nIf you didn't forget your password, please ignore this email.`;

    try {
      await sendEmail({
        email: user.email,
        subject: "Your password reset token (valid for 10 mins)",
        message,
      });

      res.status(200).json({
        status: "success",
        message: "Token sent to email!",
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      return next(
        new AppError("There was an error sending the email. Try again later"),
        500
      );
    }
  } catch (err) {
    res.status(404).json({
      status: "Failed",
      message: err,
    });
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    //1) Get user based on the token
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });
    // 2) If token has not expired, and there is a user, set the new password
    if (!user) {
      return next(new AppError("Token is invalid or has expired", 400));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();
    //3) update changedPasswordAt property for the user
    //4) Log the user in, send jwt
    createSendToken(user, 200, res);
  } catch (err) {
    res.status(404).json({
      status: "failed",
      message: err,
    });
  }
};

exports.updatePassword = async (req, res, next) => {
  //1) Get user from collection
  try {
    const user = await User.findById(req.user.id).select("+password");

    //2) Check if POSTed current password is correct
    if (
      !(await user.correctPassword(req.body.passwordCurrent, user.password))
    ) {
      return next(new AppError("your current password is wrong,", 401));
    }

    //3) if so, update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.password;
    await user.save();

    //4) Log User in, send JWT
    createSendToken(user, 200, res);
  } catch (err) {
    res.status(404).json({
      status: "failed",
      message: err,
    });
  }
};
