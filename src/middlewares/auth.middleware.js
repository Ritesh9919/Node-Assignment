import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';


export const varifyJwt = asyncHandler(async(req, res, next)=> {
    const token = req.headers['authorization'];

    if(!token) {
        throw new ApiError(401, 'Unauthorized request');
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded._id).select('-password');
        if(!user) {
            throw new ApiError(401,'Invalid access token');
        }
        req.user = user;
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || 'Invalid acess token');
    }
})