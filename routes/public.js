const express = require("express");
const publicRoute = require("../controllers/public");
const middleware = require("../middleware/jwtVarify");

const router = express.Router();
router.post("/signup", publicRoute.signup);
router.post("/signin", publicRoute.sigin);
router.get(
  "/showPerticcularProject",
  middleware.is_auth,
  publicRoute.showPerticcularProject
);

module.exports = router;
