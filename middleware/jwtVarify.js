const jwt = require("jsonwebtoken");
exports.is_auth = (req, res, next) => {
  const authorization = req.get("authorization");
  console.log(authorization);
  if (!authorization) {
    return res.send("Please login first");
  }

  const token = authorization.split(" ")[1];
  console.log("token = ", token);

  //varify the jwt token
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.send("not valid token");
    }
    // console.log("in jwt varify");
    // console.log(req);
    if (req.baseUrl === "/project" && decoded.role !== "director") {
      return res.status(401).send("Only Director can access this route");
    }
    req.payload = {
      userId: decoded.userId,
      role: decoded.role,
      email: decoded.email,
    };
    console.log("req = ", req.payload);
    next();
  });
};
