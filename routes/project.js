const express = require("express");
const {
  addProject,
  addRole,
  editProject,
  editRole,
} = require("../controllers/project");
const router = express.Router();
const middleware = require("../middleware/jwtVarify");

router.post("/addProject", middleware.is_auth, addProject);
router.post("/addRole", middleware.is_auth, addRole);
router.post("/editProject", middleware.is_auth, editProject);
router.post("/editRole", middleware.is_auth, editRole);

module.exports = router;
