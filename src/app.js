const express = require("express");
require("dotenv").config();
const app = express();
const hbs = require("hbs");
const path = require("path");
const port = process.env.PORT || 8000;
require("./db/connection");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const Register = require("./models/userRegisteration");
const auth = require("./middleware/auth");

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partial_path = path.join(__dirname, "../templates/partials");
// console.log(path.join(__dirname,"../public"))

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partial_path);

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/homepage", auth, async (req, res) => {
  console.log(`ur token is ${req.cookies.utoken}`);
  res.render("homepage");
});

app.get("/logout", auth, async (req, res) => {
  try {
    console.log(req.user);
    //logout individual user
    // req.user.tokens = req.user.tokens.filter((currToken) => {
    //   return currToken.token !== req.token;
    // });

    //logout from all devices
    req.user.tokens = [];

    res.clearCookie("utoken");
    console.log("logout");
    await req.user.save();
    res.render("login");
  } catch (e) {
    res.status(500).send(e);
  }
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  try {
    const password = req.body.password;
    const confirmpassword = req.body.confirmpassword;

    if (password === confirmpassword) {
      const registerUser = new Register({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        gender: req.body.gender,
        phone: req.body.phone,
        age: req.body.age,
        password: password,
        confirmpassword: confirmpassword,
      });

      //console.log(`the success part ${registerUser}`);

      const token = await registerUser.generateAuthToken(); //middleware

      res.cookie("utoken ", token, {
        expires: new Date(Date.now() + 60000),
        httpOnly: true,
      });

      const registered = await registerUser.save();

      res.status(201).render("index");
      //console.log(registerUser);
    } else {
      res.send("password are not matching");
    }
  } catch (e) {
    res.status(400).send(e);
  }
});

app.get("/login", (req, res) => {
  res.render("login");
});

//login check
app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const useremail = await Register.findOne({ email: email });

    const isMatch = await bcrypt.compare(password, useremail.password);

    const token = await useremail.generateAuthToken(); //middleware

    res.cookie("utoken ", token, {
      expires: new Date(Date.now() + 600000),
      httpOnly: true,
    });

    if (isMatch) {
      res.status(201).render("homepage");
    } else {
      res.send("invalid email or password");
    }
  } catch (e) {
    res.status(400).send("invalid credentials");
  }
});

app.listen(port, () => {
  console.log(`server is running at ${port}`);
});
