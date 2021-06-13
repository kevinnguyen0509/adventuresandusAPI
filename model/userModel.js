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
    require: [true, "User must have a photo"],
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

userSchema.methods.correctPassword = async function (
  canidatePassword,
  userPassword
) {
  return await bcrypt.compare(canidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
