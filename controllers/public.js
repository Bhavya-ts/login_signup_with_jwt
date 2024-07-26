const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user");
exports.sigin = async (req, res, next) => {
  const {
    body: { email, password },
  } = req;

  //check the data weather you got the data or not
  if (!email || !password) {
    return res.status(400).send("Please entre a email and password");
  }

  //validate email
  if (!validateEmail(email)) {
    return res.status(400).send("Please provide valid email ");
  }

  //check the user in database

  try {
    const user = await userModel.findOne({ email });
    // console.log(user);
    const isPasswordCorect = bcrypt.compare(password, user.password);

    if (!isPasswordCorect) {
      return res.send("Invalid Password");
    }
    // console.log(isPasswordCorect);
    //create the jwt tocken
    const jwtTocken = jwt.sign(
      { userId: user._id, email, role: user.role },
      process.env.SECRET_KEY,
      {
        expiresIn: 60 * 60,
      }
    );

    res.cookie("accessToken", jwtTocken);

    // return jwt token
    return res.send({
      message: "Logged In Successfully",
      jwtTocken,
    });
  } catch (error) {
    return res.status(501).send("Something went wrong");
  }
};

//signup the user
exports.signup = async (req, res, next) => {
  console.log("inside sign up function ");
  const { name, email, role, password } = req.body;
  console.log(req.body);
  console.log(name, email, role, password);
  //check weather we are getting the data or not
  if (!name || !email || !role || !password) {
    return res.status(400).send("Please provide all details");
  }

  //validate email
  if (!validateEmail(email)) {
    res.status(400);
    return res.send("Please provide valid email address");
  }

  //create hash password
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);
  console.log("password = ", passwordHash);
  // save the new user
  const newUser = new userModel({
    name,
    email,
    role,
    password: passwordHash,
  }).save();
  console.log("this is sign up function");
  return res.status(200).send("user created");
};

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};
