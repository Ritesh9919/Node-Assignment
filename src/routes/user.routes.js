import express from 'express';
const router = express.Router();

import {
    registerUser,
    loginUser, 
    updateUserDeatails, 
    deleteUserAccount,
    
    
} from '../controllers/user.controller.js';


import {upload} from '../middlewares/multer.middleware.js';
import { varifyJwt } from '../middlewares/auth.middleware.js';
import { authorizeAdmin } from '../middlewares/authorizeAdmin.middleware.js';


router.post('/register', upload.single('profileImage'),registerUser);
router.post('/login', loginUser);
router.put('/:userId', varifyJwt,upload.single('profileImage'),updateUserDeatails);
router.delete('/:userId', varifyJwt, deleteUserAccount);





export default router;