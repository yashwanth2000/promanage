import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import errorHandler from "../utils/error.js";

export const register = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(errorHandler(409, "Email already in use"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashedPassword });

    await user.save();

    res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    next(errorHandler(500, "Internal Server Error"));
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const validUser = await User.findOne({ email });

    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }

    const validPassword = await bcrypt.compare(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(401, "Invalid credentials"));
    }

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET,{ expiresIn: '1h' });
    const { password: pass, ...userData } = validUser._doc;

    res
      .cookie("accessToken", token, { httpOnly: true })
      .status(200)
      .json({success: true, user: userData, token });
  } catch (error) {
    next(errorHandler(500, "Internal Server Error"));
  }
};

export const logout = async (req, res, next) => {
  try {
    res.clearCookie("accessToken");
    res.status(200).json({success: true, message: "User Logged out successfully" });
  } catch (error) {
    next(errorHandler(500, "Internal Server Error"));
  }
};
