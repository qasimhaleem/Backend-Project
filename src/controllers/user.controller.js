import { asyncHandler } from '../utils/asyncHandler.js';
import { User } from '../models/user.models.js'
import { apiError } from '../utils/apiError.js'
import {uploadOnCloudinary} from '../utils/fileUpload.js'
import { apiResponse } from '../utils/apiResponse.js';
const registerUser = asyncHandler(async (req, res) => {
    // frontend data collection
    const { fullName, email, username, password } = req.body
    console.log("email : ", email)

    // apply validation
    if ([
        fullName, email, username, password].some((field) =>
            field?.trim() === "" || field === undefined)) {
        throw new apiError(400, "all field are requierd")
    }

    //check user existance before creation
    const existedUser = User.findOne({
        $or: [{ username }, { email }]
    })
    if (existedUser) {
        throw new apiError(409, "User already exist with name/ email try other")
    }
    
    // check for the avatar and coverImage that uplaoded or not
    
    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImageLocalPath = req.files?.coverImage[0]?.path
    
    if(!avatarLocalPath) {
        throw new apiError(400, "Avatar is required")
    }
    
    //uplaod the avatar on cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    
    if(!avatar) {
        throw new apiError(400, "Avatar is required")
    }


    // database entry
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })
    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if(!createdUser) {
        throw new apiError(500, "error occure while creating user")
    }

    return res.status(201).json(
        new apiResponse(200, createdUser, "user Registerd sucssefully,")
    )

})

export default registerUser