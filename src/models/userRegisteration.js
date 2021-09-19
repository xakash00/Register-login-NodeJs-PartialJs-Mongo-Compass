const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    requiured: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
    unique: true,
  },
  age: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  confirmpassword: {
    type: String,
    required: true,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

//jsonWebToken

userSchema.methods.generateAuthToken = async function () {
  try {
    //console.log(this._id);
    const token = await jwt.sign({ _id: this._id.toString() }, process.env.KEY);
    this.tokens = this.tokens.concat({ token: token });
    await this.save();
    //console.log(token);
    return token;
  } catch (e) {
    res.send(`the error part ${e}`);
    console.log(`the erroe part ${e}`);
  }
};

//converting password into hash
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    // console.log(`password is ${this.password}`);
    this.password = await bcrypt.hash(this.password, 10);
    this.confirmpassword = await bcrypt.hash(this.password, 10);
    // console.log(`hash code is ${this.password}`);
  }
  next();
});

const Register = new mongoose.model("Register", userSchema);

module.exports = Register;
