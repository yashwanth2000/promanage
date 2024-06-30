import jwt from "jsonwebtoken";
import errorHandler from "../utils/error.js";
import User from "../models/user.model.js";

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id);
      if (!user) {
        return next(errorHandler(404, "User not found"));
      }

      req.user = {
        id: user._id.toString(),
        email: user.email,
      };
      next();
    } catch (err) {
      return next(errorHandler(403, "Token is not valid!"));
    }
  } else {
    return next(errorHandler(401, "You are not authenticated!"));
  }
};

export default verifyToken;
