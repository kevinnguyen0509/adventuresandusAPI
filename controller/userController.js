const User = require("./../model/userModel");
const AppError = require("./../utils/AppError");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

exports.getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find();
    res.status(200).json({
      result: allUsers.length,
      status: "Success",
      allUsers: allUsers,
    });
  } catch (err) {}
};

exports.updateMe = async (req, res, next) => {
  try {
    //1)creat error if user POSTS password data
    if (req.body.password || req.body.passwordConfirm) {
      return next(
        new AppError(
          "This route is not for password updates. Use /updateMyPassword to update password",
          400
        )
      );
    }

    //2)update user document
    const filteredBody = filterObj(req.body, "name", "email");
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      filteredBody,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: "success",
      data: {
        user: updatedUser,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "Failed",
      message: err,
    });
  }
};
