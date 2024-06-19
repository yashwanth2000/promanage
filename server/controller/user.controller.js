import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import errorHandler from "../utils/error.js";

export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { name, email, oldPassword, newPassword } = req.body;
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    let updateMessage = "";

    if (name) {
      user.name = name;
      updateMessage += "Name updated. ";
    }

    if (email) {
      user.email = email;
      updateMessage += "Email updated. ";
    }

    if (newPassword) {
      if (!oldPassword) {
        return next(
          errorHandler(400, "Old password is required to set a new password")
        );
      }

      const isPasswordCorrect = await bcrypt.compare(
        oldPassword,
        user.password
      );
      if (!isPasswordCorrect) {
        return next(errorHandler(401, "Invalid old password"));
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      updateMessage += "Password updated. ";
    }

    if (!name && !email && !newPassword) {
      return next(errorHandler(400, "No valid fields to update"));
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: updateMessage.trim(),
      user: updatedUser,
    });
  } catch (error) {
    console.log(error);
    next(errorHandler(500, "Internal Server Error"));
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id)
      return next(
        errorHandler(403, "You are not authorized to delete this account")
      );
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("accessToken");
    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
