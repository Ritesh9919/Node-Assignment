import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerAdmin = asyncHandler(async (req, res) => {
  const { name, email, password, phoneNumber, role } = req.body;

  if (!email || !phoneNumber) {
    throw new ApiError(400, "email or phoneNumber is required");
  }

  const adminProfileLocalPath = req.file?.path;
  if (!adminProfileLocalPath) {
    throw new ApiError(400, "admin profile file is required");
  }

  const adminProfile = await uploadOnCloudinary(adminProfileLocalPath);
  if (!adminProfile) {
    throw new ApiError(400, "admin profile file is required");
  }

  const admin = await User.create({
    name,
    email,
    phoneNumber,
    password,
    role,
    profileImage: adminProfile.url,
  });

  const registeredAdmin = await User.findById(admin._id).select("-password");
  return res
    .status(201)
    .json(
      new ApiResponse(200, registeredAdmin, "admin registered successfully")
    );
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");
  if (!users) {
    throw new ApiError(404, "users does not exist");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, users, "users fetched successfully"));
});

const updateUserDeatailsByAdmin = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { name } = req.body;

  if (!name) {
    throw new ApiError(400, "name is required");
  }
  6;

  const userProfileLocalPath = req.file?.path;
  if (!userProfileLocalPath) {
    throw new ApiError(400, "userProfile file is required");
  }

  const profileImage = await uploadOnCloudinary(userProfileLocalPath);
  if (!profileImage) {
    throw new ApiError(400, "userProfile file is required");
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { name, profileImage: profileImage.url },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "user updated successfully"));
});

const deleteUserAccountByAdmin = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findByIdAndDelete(userId, { new: true });
  return res
    .status(200)
    .json(new ApiResponse(200, user, "user deleted successfully"));
});

export {
  getAllUsers,
  registerAdmin,
  updateUserDeatailsByAdmin,
  deleteUserAccountByAdmin,
};
