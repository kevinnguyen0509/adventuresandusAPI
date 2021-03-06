const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
//name, email, photo, password, passwordConfirm, friends: [], boards:[],

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, "User must have a name."],
    maxLength: [50, "You can only have a max of 50 charaters."],
  },

  email: {
    type: String,
    require: [true, "User must have Email"],
    maxLength: [50, "You can only have a max of 50 charaters."],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please put in a valid email"],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    require: [true, "User must have a password"],
    minlength: 4,
    select: false,
  },
  passwordConfirm: {
    type: String,
    require: [true, "Passwords must match"],
    validate: {
      //Only works on CREATE and SAVE
      validator: function (element) {
        return element === this.password;
      },
      message: "Passwords are not the same.",
    },
  },

  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  friends: {
    type: [String], //Stores friends IDs
    default: [],
  },
  boards: {
    type: [String], //Stores board you are apart of IDs
    default: [],
  },
});

userSchema.pre("save", async function (next) {
  //Only run if password was modified
  if (!this.isModified("password")) return next();

  // Has the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  //Delete confirm password
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.correctPassword = async function (
  canidatePassword,
  userPassword
) {
  return await bcrypt.compare(canidatePassword, userPassword);
};

userSchema.methods.changedpasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    console.log(changedTimestamp, JWTTimestamp);
    return JWTTimestamp < changedTimestamp;
  }
  //False is not changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  //console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
