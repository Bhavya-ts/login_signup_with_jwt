const express = require("express");
const publicRoute = require("../controllers/public");

const router = express.Router();
router.post("/signup", publicRoute.signup);
router.post("/signin", publicRoute.sigin);

module.exports = router;
