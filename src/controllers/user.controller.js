import { asyncHandler } from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"


const registerUser = asyncHandler(async (req, res) => {
    // Get Data from forontend
    const { username, email, fullName, password } = req.body

    // empty validation
    if ([username, email, fullName, password].some(field=>field?.trim()==="")) {
        throw new ApiError(400, "All field are required")
    }

    // check if user exist or not

    const existedUser = await User.findOne({
        $or: [{ username }, {email}]
    })

    if (existedUser) {
        throw new ApiError(409, "User Already exist!")
    }

    // upload file
    const avatarLocalPath = req.files?.avatar[0]?.path;

    // check if avtar has been uploaded or not
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar image is required!")
    }

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    // if avatar not been upload in cloudinary
    if (!avatar) {
        throw new ApiError(400, "Avatar file is requiredddd")
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createUser = await User.findById(user._id).select(
    "-password -refreshToken"
    )

    if (!createUser) {
        throw new ApiError(500, "Something went wrong while registring user")
    }

    return res.status(201).json(
        new ApiResponse(200, createUser, "User registered Successfully")
    )


})

export { registerUser }