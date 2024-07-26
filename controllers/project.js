const project = require("../models/project");
const roleModel = require("../models/role");
exports.addProject = async (req, res, next) => {
  const {
    body: { name, description },
  } = req;

  //if details is not there then return the user
  if (!name || !description) {
    return res.status(400).send("Please enter a data");
  }

  const newProject = await new project({
    name,
    description,
    createdBy: req.payload.userId,
  }).save();

  return res.status(200).send("Project succesfully created");
};

exports.addRole = async (req, res, next) => {
  const {
    body: { projectId, name, role, description },
  } = req;

  //if any data is not there then return the user
  if (!projectId || !name || !role || !description) {
    return res.status(400).send("Please enter a valid detail");
  }
  console.log("project Id =  ", projectId);

  //check a project status if draft then only add role
  const chekStatus = await project.findById(projectId);
  console.log("checkstatus : ", chekStatus.status);

  if (chekStatus === "Active") {
    return res.send("Project is in active status, you can't add role now");
  }

  const newRole = await new roleModel({
    projectId,
    name,
    role,
    description,
  }).save();
  return res.send("Role succesfully added");
};
exports.editProject = async (req, res, next) => {
  const { projectId, name, description, status } = req.body;

  const projectData = await project.findById(projectId);

  if (projectData.createdBy !== req.payload.userId) {
    return res
      .status(400)
      .send(
        "As you have not created the project you are not allow to change the project "
      );
  }

  const update = await project.updateOne(
    { _id: projectId },
    { name, description, status }
  );

  return res.status(200).send("project is updated");
};

exports.editRole = async (req, res, next) => {
  const { _id, projectId, name, role, description } = req.body;

  const projectData = await project.findById(projectId);

  if (projectData.createdBy !== req.payload.userId) {
    return res
      .status(400)
      .send(
        "As you have not created the project you are not allow to change the role "
      );
  }

  const update = await roleModel.updateOne(
    { _id },
    { projectId, name, role, description }
  );

  return res.status(200).send("role is updated");
};
