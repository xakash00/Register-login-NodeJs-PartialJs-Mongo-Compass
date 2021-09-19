const jwt = require("jsonwebtoken");
const Register = require("../models/userRegisteration");

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.utoken;
    const verifyuser = jwt.verify(token, process.env.KEY);
    console.log(verifyuser);

    const user = await Register.findOne({ _id: verifyuser._id });
    console.log(user);

    req.token = token;
    req.user = user;

    next();
  } catch (e) {
    res.status(401).send(e);
  }
};

module.exports = auth;
