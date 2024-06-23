import jwt from "jsonwebtoken";
import errorHandler from "../utils/error.js";

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return next(errorHandler(403, "Token is not valid!"));
      }
      req.user = user;
      next();
    });
  } else {
    return next(errorHandler(401, "You are not authenticated!"));
  }
};

export default verifyToken;
