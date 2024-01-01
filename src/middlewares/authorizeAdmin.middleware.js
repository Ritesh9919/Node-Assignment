import { ApiError } from "../utils/ApiError.js";

export const authorizeAdmin = (req, res, next)=> {
    console.log(req.user.role);
    if(req.user.role !== 'admin') {
        throw new ApiError(401, 'Unauthorized to access this route');
    }
    next()
}