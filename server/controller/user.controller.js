import User from "../models/user.model.js";
import Task from "../models/task.model.js";
import bcrypt from "bcrypt";
import errorHandler from "../utils/error.js";
import jwt from "jsonwebtoken";

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
    let isUpdated = false;

    if (name && name !== user.name) {
      user.name = name;
      updateMessage += "Name updated. ";
      isUpdated = true;
    }

    if (email && email !== user.email) {
      user.email = email;
      updateMessage += "Email updated. ";
      isUpdated = true;
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

      if (oldPassword === newPassword) {
        return next(
          errorHandler(
            400,
            "New password must be different from the old password"
          )
        );
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      updateMessage += "Password updated. ";
      isUpdated = true;
    }

    if (!isUpdated) {
      return next(errorHandler(400, "No changes detected."));
    }

    const updatedUser = await user.save();
    const { password, ...userData } = updatedUser._doc;

    let token = null;
    if (newPassword) {
      token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
    }

    res.status(200).json({
      success: true,
      message: updateMessage.trim(),
      user: userData,
      token: token,
    });
  } catch (error) {
    next(errorHandler(500, "Internal Server Error"));
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id)
      return next(
        errorHandler(403, "You are not authorized to delete this account")
      );

    // Find and delete all tasks created by the user
    await Task.deleteMany({ createdBy: req.params.id });

    // Delete the user
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "User account and all associated tasks deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
