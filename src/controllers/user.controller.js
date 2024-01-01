import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, phoneNumber, password } = req.body;

  if (!password || !phoneNumber) {
    throw new ApiError(400, "email or phoneNumber is required");
  }

  const isUserExist = await User.findOne({ $or: [{ email }, { phoneNumber }] });
  if (isUserExist) {
    throw new ApiError(409, "User already exist");
  }

  const userProfileLocalPath = req.file?.path;

  if (!userProfileLocalPath) {
    throw new ApiError(400, "userProfile file is required");
  }

  const userProfile = await uploadOnCloudinary(userProfileLocalPath);

  if (!userProfile) {
    throw new ApiError(400, "userProfile file is required");
  }

  const user = await User.create({
    name,
    email,
    password,
    phoneNumber,
    profileImage: userProfile.url,
  });

  const createdUser = await User.findById(user._id).select("-password");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User register successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, phoneNumber, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "email or password is required");
  }

  const user = await User.findOne({ $or: [{ email }, { phoneNumber }] });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Inavalid user Credential");
  }

  const accessToken = await user.generateAccessToken();
  const loggedInUser = await User.findById(user._id).select("-password");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken },
        "User login successfully"
      )
    );
});

const updateUserDeatails = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { name } = req.body;

  if (!name) {
    throw new ApiError(400, "all fields are required");
  }

  if (!req.user._id.equals(userId)) {
    throw new ApiError(401, "Unauthrized request");
  }

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

const deleteUserAccount = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  console.log(req.user._id);
  if (!req.user._id.equals(userId)) {
    throw new ApiError(401, "Unauthorized request");
  }

  const user = await User.findByIdAndDelete(userId, { new: true });
  return res
    .status(200)
    .json(new ApiResponse(200, user, "user deleted successfully"));
});

export { registerUser, loginUser, updateUserDeatails, deleteUserAccount };
