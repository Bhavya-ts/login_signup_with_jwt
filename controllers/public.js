const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user");
const roleModel = require("../models/role");
const projectModel = require("../models/project");
const role = require("../models/role");

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

exports.showPerticcularProject = async (req, res, next) => {
  const { projectId } = req.body;

  //if peoject id is not there then return
  if (!projectId) {
    res.send("seelct project you want to watch");
  }
  try {
    const projectData = await projectModel.findOne({ _id: projectId });

    if (!projectData) {
      return res.send("no project found with this id");
    }
    const roleData = await roleModel.find({ projectId: projectData._id });

    console.log("role of list ", roleData);

    // Add role data to projectData
    // projectData.roles = roleData;
    const newProjectData = { projectData, role: roleData };

    // Send the updated project data as a response

    console.log("project data ", newProjectData);
    if (projectData.status === "Active") {
      console.log("status ", projectData.status);
      return res.status(200).send(projectData);
      // res.status(200).send("role Data ", roleData);
    }

    if (projectData.createdBy !== req.payload.userId) {
      return res
        .status(300)
        .send(
          "as you have not created this project and project is still in a drafting process because of that you are not allowd to access or watch this  project "
        );
    }
    // return res.status(200).send(projectData);
    res.json(projectData);
  } catch (error) {
    return res.error(error);
  }

  // const projectData = await projectModel.findOne({ _id: projectId });
  // const roleData = await roleModel.find({ projectId: projectData._id });
  // projectData.roles = roleData;

  // Now you can use projectData with the roles included
  // console.log(projectData);
  // projectData.role = roleData;

  // return res.status(200).send(projectData);
};

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};
